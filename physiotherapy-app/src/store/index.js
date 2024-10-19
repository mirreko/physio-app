import { createStore } from 'vuex';

const store = createStore({
  state: {
    selectedPatient: null,
    trainingPlanId: null,
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
    }
  },
  actions: {
    selectPatient({ commit }, patient) {
      commit('setSelectedPatient', patient);
    },
  },
  getters: {
    getSelectedPatient(state) {
      return state.selectedPatient;
    },
    getTrainingPlanId: (state) => state.trainingPlanId,
  },
});

export default store; 
