import { createStore } from 'vuex';

const store = createStore({
  state: {
    selectedPatient: null,
    trainingPlanId: null,
    trainingPlan: null,
    patientName: '',
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
    },
    SET_CURRENT_TRAINING_PLAN(state, trainingPlan) {
      state.trainingPlan = trainingPlan;
    },
    setPatientName(state, name) {
      state.patientName = name;
    },
  },
  actions: {
    selectPatient({ commit }, patient) {
      commit('setSelectedPatient', patient);
    },
    async fetchCurrentTrainingPlan({ commit }) {
     
      const patientId = localStorage.getItem("patientId"); // Beispiel für das Abrufen der Patient-ID
     
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
    }
    
  },
  getters: {
    getSelectedPatient(state) {
      return state.selectedPatient;
    },
    getTrainingPlanId: (state) => state.trainingPlanId,
    getCurrentTrainingPlan: (state) => state.trainingPlan,
    getPatientName: (state) => state.patientName,
  },
  
});

export default store; 
