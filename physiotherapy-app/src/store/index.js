import { createStore } from 'vuex';

const store = createStore({
  state: {
    selectedPatient: null,
  },
  mutations: {
    setSelectedPatient(state, patient) {
      state.selectedPatient = patient;
    },
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
  },
});

export default store; 
