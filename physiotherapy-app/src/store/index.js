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
      const patientId = state.selectedPatient?.id;
      const savedData = localStorage.getItem(`workoutData_${patientId}`);
      
      const currentStartOfWeek = getStartOfCurrentWeek();
      const savedStartOfWeek = new Date(localStorage.getItem(`startOfWeek_${patientId}`));
    
      if (savedData) {
        const { weeklyWorkoutsRemaining, lastResetDate } = JSON.parse(savedData);
    
        // Prüfen, ob die Woche gewechselt hat
        if (!savedStartOfWeek || currentStartOfWeek > savedStartOfWeek) {
          // Setze den Counter auf den initialen Wert
          state.weeklyWorkoutsRemaining = trainingPlan.frequency;
          state.lastResetDate = new Date();
          localStorage.setItem(`startOfWeek_${patientId}`, currentStartOfWeek.toISOString());
        } else {
          // Setze den Counter auf den gespeicherten Wert
          state.weeklyWorkoutsRemaining = weeklyWorkoutsRemaining;
          state.lastResetDate = lastResetDate;
        }
      } else if (trainingPlan.frequency) {
        // Wenn kein gespeichertes Workout existiert, setze den initialen Wert
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
    },
  },
  actions: {
    selectPatient({ commit }, patient) {
      commit('setSelectedPatient', patient);
    },
    async fetchCurrentTrainingPlan({ commit }) {
      const patientId = localStorage.getItem("patientId");

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
      } catch (error) {
        console.error("Fehler beim Abrufen des Trainingsplans:", error);
      }
    },
    markWorkoutCompleted({ commit }) {
      commit('DECREMENT_WORKOUT_COUNT');
    },
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
  },
  getters: {
    getSelectedPatient(state) {
      return state.selectedPatient;
    },
    getTrainingPlanId: (state) => state.trainingPlanId,
    getCurrentTrainingPlan: (state) => state.trainingPlan,
    getPatientName: (state) => state.patientName,
    getRemainingWorkouts: (state) => state.weeklyWorkoutsRemaining,
    getUserPoints: (state) => state.points,
  },
  plugins: [
    createPersistedState({
      paths: ['patientName', 'selectedPatient', 'weeklyWorkoutsRemaining'], // Spezifiziere, welche Daten gespeichert werden sollen
    }),
  ],
});

export default store;
