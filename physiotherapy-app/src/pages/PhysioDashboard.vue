<template>
  <div class="flex flex-col">
    <Header class="w-full p-6 sticky top-0" />
    <div class="flex flex-1">
      <Sidebar
        class="sm:w-1/3 lg:w-1/5 md:w-1/3 p-4 "
        @update:search-query="updateSearchQuery"
        @update:selected-difficulty="updateSelectedDifficulty"
      />
      <main class="flex-1 p-6 min-h-screen">
        <h2 class="text-2xl font-bold mb-4">Willkommen, Physio!</h2>
        <PatientSelection :patients="patients" />
        <template v-if="!selectedExercise">
          <ExerciseList
            :exercises="exercises"
            :searchQuery="searchQuery"
            :selectedDifficulty="selectedDifficulty"
            @selectExercise="showExerciseDetail"
          />
        </template>
        <template v-else>
          <ExerciseDetail 
            :exercise-id="selectedExercise"
            @closeDetail="closeExerciseDetail"
          />
        </template>
      </main>
    </div>
  </div>
</template>

<script>
import Header from "../components/physio/Header.vue";
import Sidebar from "../components/physio/Sidebar.vue";
import ExerciseList from "../components/physio/ExerciseList.vue";
import PatientSelection from "../components/physio/PatientSelection.vue";
import ExerciseDetail from "../components/physio/ExerciseDetail.vue";

export default {
  name: "PhysioDashboard",
  components: {
    Header,
    Sidebar,
    ExerciseList,
    PatientSelection,
    ExerciseDetail,
  },
  data() {
    return {
      exercises: [],
      patients: [],
      filteredExercises: [],
      searchQuery: "",
      selectedDifficulty: ''
    };
  },
  async created() {
    await this.fetchData(); 
    this.filteredExercises = this.exercises;
  },
  methods: {
    updateSearchQuery(query) {
      this.searchQuery = query;
      this.filterExercises();
    },
    updateSelectedDifficulty(difficulty) {
      this.selectedDifficulty = difficulty;
      this.filterExercises();
    },
    filterExercises() {
      this.filteredExercises = this.exercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesDifficulty = this.selectedDifficulty ? exercise.difficulty === this.selectedDifficulty : true;
        
        // Weitere Filterbedingungen hier hinzufügen

        return matchesSearch && matchesDifficulty;
      });
    },
    async fetchData() {
      try {
        const exerciseResponse = await fetch(
          "http://localhost:5500/api/exercises"
        );
        this.exercises = await exerciseResponse.json();

        const patientResponse = await fetch("http://localhost:5500/api/users");
        this.patients = await patientResponse.json();
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    },
    showExerciseDetail(exerciseId) {
      this.selectedExercise = exerciseId; // Setzt die ausgewählte Übung
    },
    closeExerciseDetail() {
      this.selectedExercise = null; // Setzt die ausgewählte Übung zurück
    },
  },
};
</script>
