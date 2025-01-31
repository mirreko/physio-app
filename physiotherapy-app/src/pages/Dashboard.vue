<template>
  <div class="flex flex-col">
    <Header class="w-full p-6 sticky top-0" />
    <div class="flex flex-1">
      <Sidebar
        class="sm:w-1/3 lg:w-1/5 md:w-1/3 p-4 h-[calc(100vh-8rem)]"
        @update:search-query="updateSearchQuery"
        @update:selected-difficulty="updateSelectedDifficulty"
      />
      <main class="flex-1 p-6 min-h-screen">
        <router-view v-if="$route.name === 'ExerciseDetail'" />
        <template v-else>
          <h2 class="text-2xl font-bold mb-4">Willkommen, Physio!</h2>
          <PatientSelection :patients="patients" />
          <ExerciseList
            :exercises="exercises"
            :searchQuery="searchQuery"
            :selectedDifficulty="selectedDifficulty"
          />
        </template>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import ExerciseList from '../components/ExerciseList.vue';
import PatientSelection from '../components/PatientSelection.vue';

export default {
  name: 'Dashboard',
  components: {
    Header,
    Sidebar,
    ExerciseList,
    PatientSelection,
  },
  data() {
    return {
      searchQuery: '',
      selectedDifficulty: '',
      exercises: [], // Neu hinzugefügt
      patients: [],  // Neu hinzugefügt
    };
  },
  async created() {
    await this.fetchData(); // Lädt Daten, wenn das Dashboard erstellt wird
  },
  methods: {
    updateSearchQuery(query) {
      this.searchQuery = query;
    },
    updateSelectedDifficulty(difficulty) {
      this.selectedDifficulty = difficulty;
    },
    async fetchData() {
      try {
        const exerciseResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/exercises`);
        this.exercises = await exerciseResponse.json();

        const patientResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/patients`);
        this.patients = await patientResponse.json();
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
      }
    },
  },
};
</script>
