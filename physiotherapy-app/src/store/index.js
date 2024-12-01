import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

function getStartOfCurrentWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(now.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

const store = createStore({
  state: {
    selectedPatient: null,
    trainingPlanId: null,
    trainingPlan: null,
    patientName: '',
    weeklyWorkoutsRemaining: null,
    lastResetDate: null,
    points: 0, // Gesamtpunkte
  },
  mutations: {
    setSelectedPatient(state, patient) {
      state.selectedPatient = patient;
    },
    setTrainingPlanId(state, trainingPlanId) {
      state.trainingPlanId = trainingPlanId;
    },
    clearTrainingPlan(state) {
      state.trainingPlanId = null;
      state.weeklyWorkoutsRemaining = null;
      state.lastResetDate = null;
    },
    SET_CURRENT_TRAINING_PLAN(state, trainingPlan) {
      state.trainingPlan = trainingPlan;
      const trainingPlanId = trainingPlan._id;
      state.trainingPlanId = trainingPlanId;

      const patientId = state.selectedPatient?.id;
      const savedData = localStorage.getItem(`workoutData_${patientId}`);
      
      const currentStartOfWeek = getStartOfCurrentWeek();
      const savedStartOfWeek = new Date(localStorage.getItem(`startOfWeek_${patientId}`));
    
      if (savedData) {
        const { weeklyWorkoutsRemaining, lastResetDate } = JSON.parse(savedData);
    
        // Prüfen, ob die Woche gewechselt hat
        if (!savedStartOfWeek || currentStartOfWeek > savedStartOfWeek) {
          state.weeklyWorkoutsRemaining = trainingPlan.frequency;
          state.lastResetDate = new Date();
          localStorage.setItem(`startOfWeek_${patientId}`, currentStartOfWeek.toISOString());
        } else {
          state.weeklyWorkoutsRemaining = weeklyWorkoutsRemaining;
          state.lastResetDate = lastResetDate;
        }
      } else if (trainingPlan.frequency) {
        state.weeklyWorkoutsRemaining = trainingPlan.frequency;
        state.lastResetDate = new Date();
        localStorage.setItem(`startOfWeek_${patientId}`, currentStartOfWeek.toISOString());
      }
    
      this.commit('SAVE_WORKOUT_DATA');
    },
    SAVE_WORKOUT_DATA(state) {
      const patientId = state.selectedPatient?.id;
      
      if (!patientId) return;
      
      const data = {
        weeklyWorkoutsRemaining: state.weeklyWorkoutsRemaining,
        lastResetDate: state.lastResetDate,
      };
    
      // Speichern in localStorage
      localStorage.setItem(`workoutData_${patientId}`, JSON.stringify(data));
    },
    
    setPatientName(state, name) {
      state.patientName = name;
    },
    DECREMENT_WORKOUT_COUNT(state) {
      if (state.weeklyWorkoutsRemaining > 0) {
        state.weeklyWorkoutsRemaining -= 1;
        this.commit('SAVE_WORKOUT_DATA');
      }
    },
    SET_POINTS(state, points) {
      state.points = points;
      this.commit('SAVE_POINTS');
    },
    UPDATE_POINTS(state, points) {
      state.points += points;
    },
    SAVE_POINTS(state) {
      const patientId = state.selectedPatient?.id;
      if (patientId) {
        localStorage.setItem(`points_${patientId}`, state.points);
      }
    },
  },
  actions: {
    // Hole den aktuellen Trainingsplan direkt aus der DB
    async fetchCurrentTrainingPlan({ commit }) {
      const patientId = localStorage.getItem("patientId");
      if (!patientId) {
        console.error("Patient ID nicht gefunden.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5500/api/trainingplans/${patientId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        commit("SET_CURRENT_TRAINING_PLAN", data[0]);
        commit("SET_POINTS", data[0].points || 0); // Punkte aus DB setzen
      } catch (error) {
        console.error("Fehler beim Abrufen des Trainingsplans:", error);
      }
    },

    // Markiere das Workout als erledigt und aktualisiere den Counter
    async markWorkoutCompleted({ commit, state }) {

      // Workout-Counter lokal im Vuex-Store aktualisieren
      commit('DECREMENT_WORKOUT_COUNT');

      const trainingPlanId = state.trainingPlanId;
      console.log("Trainingsplan-ID:", trainingPlanId);

      if (!trainingPlanId) {
        console.error("Trainingsplan ID nicht gefunden.");
        return;
      }
    
      // Workout-Counter auf dem Server aktualisieren
      try {
        const response = await fetch(`http://localhost:5500/api/trainingplans/${trainingPlanId}/workouts`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ frequency: state.weeklyWorkoutsRemaining }), // Sende den aktuellen Wert der verbleibenden Workouts
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        console.log("Workout-Counter erfolgreich in der DB aktualisiert.");
      } catch (error) {
        console.error("Fehler beim Aktualisieren des Workout-Counters in der DB:", error);
      }
    },
    
    
    // Fetch-Punkte des Benutzers aus der DB
    async fetchUserPoints({ commit }) {
      const patientId = localStorage.getItem("patientId");
      try {
        const response = await fetch(`http://localhost:5500/api/users/${patientId}/points`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        commit("SET_POINTS", data.points);
      } catch (error) {
        console.error("Fehler beim Abrufen der Punkte:", error);
      }
    },
    
    // Update die Punkte des Benutzers
    updatePoints({ commit, state }, points) {
      commit('SET_POINTS', points);
      // Update auf dem Server
      const patientId = localStorage.getItem("patientId");
      if (patientId) {
        fetch(`http://localhost:5500/api/users/${patientId}/points`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ points }),
        })
        .then(response => {
          if (!response.ok) throw new Error('Fehler beim Aktualisieren der Punkte');
          console.log('Punkte erfolgreich auf dem Server aktualisiert');
        })
        .catch(error => {
          console.error('Fehler beim Synchronisieren der Punkte', error);
        });
      }
    },
  },
  getters: {
    getSelectedPatient(state) {
      return state.selectedPatient;
    },
    getTrainingPlanId: (state) => state.trainingPlanId,
    getCurrentTrainingPlan: (state) => state.trainingPlan,
    getPatientName: (state) => state.patientName,
    getRemainingWorkouts: (state) => state.weeklyWorkoutsRemaining,
    getPoints(state) {
      return state.points;
    },
  },
  plugins: [
    createPersistedState({
      paths: ['patientName', 'selectedPatient', 'weeklyWorkoutsRemaining','points'],
    }),
  ],
});

export default store;
