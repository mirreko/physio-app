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
    points: 0, 
    streak: 0,
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
        const { weeklyWorkoutsRemaining, lastResetDate, streak } = JSON.parse(savedData);
    
        // Prüfen, ob die Woche gewechselt hat
        if (!savedStartOfWeek || currentStartOfWeek > savedStartOfWeek) {
          state.weeklyWorkoutsRemaining = trainingPlan.frequency;
          state.lastResetDate = new Date();
          state.streak = 0;  // Streak zurücksetzen, wenn die Woche neu beginnt
          localStorage.setItem(`startOfWeek_${patientId}`, currentStartOfWeek.toISOString());
        } else {
          state.weeklyWorkoutsRemaining = weeklyWorkoutsRemaining;
          state.lastResetDate = lastResetDate;
          state.streak = streak;  // Streak aus gespeicherten Daten laden
        }
      } else if (trainingPlan.frequency) {
        state.weeklyWorkoutsRemaining = trainingPlan.frequency;
        state.lastResetDate = new Date();
        state.streak = 0; // Initialisieren, wenn keine gespeicherten Daten vorhanden sind
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
        streak: state.streak, // Speichern des Streaks
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
    SET_STREAK(state, streak) {
      state.streak = streak;
    },
    UPDATE_STREAK(state, newStreak) {
      state.streak = newStreak;
      this.commit('SAVE_WORKOUT_DATA'); // Streak auch in localStorage speichern
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
    
      // Streak erhöhen
      let newStreak = state.streak + 1; // Erhöhe den Streak um 1
    
      // Wenn der Benutzer die maximale Anzahl von wöchentlichen Workouts erreicht hat, 
      // setzen wir den Streak auf 0 (woche zurückgesetzt)
      if (state.weeklyWorkoutsRemaining <= 0) {
        newStreak = 0;
      }
    
      commit('UPDATE_STREAK', newStreak); // Den Streak im Vuex-Store aktualisieren
    
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
    async fetchStreak({ commit }) {
      const patientId = localStorage.getItem('patientId');
      if (!patientId) return;
    
      try {
        const response = await fetch(`http://localhost:5500/api/users/${patientId}/streak`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
    
        if (!response.ok) throw new Error('Fehler beim Abrufen der Streak');
        const data = await response.json();
        commit('SET_STREAK', data.streak);
      } catch (error) {
        console.error('Fehler beim Abrufen der Streak:', error);
      }
    },
    
    async updateStreak({ commit }, { patientId, newStreak }) {
      try {
        const response = await fetch(`http://localhost:5500/api/users/${patientId}/streak`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ streak: newStreak }),
        });
    
        if (!response.ok) throw new Error('Fehler beim Aktualisieren der Streak.');
    
        const data = await response.json();
        commit('SET_STREAK', data.streak);
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Streak:', error);
      }
    },
    
  },
  getters: {
    getSelectedPatient(state) {
      return state.selectedPatient;
    },
    getPoints(state) {
      return state.points;
    },
    getTrainingPlanId: (state) => state.trainingPlanId,
    getCurrentTrainingPlan: (state) => state.trainingPlan,
    getPatientName: (state) => state.patientName,
    getRemainingWorkouts: (state) => state.weeklyWorkoutsRemaining,
    getStreak: (state) => state.streak,
  },
  plugins: [
    createPersistedState({
      paths: ['patientName', 'selectedPatient', 'weeklyWorkoutsRemaining', 'points', 'streak'],
    }),    
  ],
});

export default store;
