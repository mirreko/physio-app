<template>
  <div class="mt-6 p-6 bg-background rounded-2xl">
    <h2 class="text-2xl font-bold mb-4">Übungen</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="exercise in filteredExercises"
        :key="exercise._id"
        class="bg-white p-4 border rounded-2xl shadow hover:shadow-md cursor-pointer transition-shadow"
        @click="viewDetails(exercise)"
      >
        <img
          :src="exercise.image"
          alt="Uebung Bild"
          class="w-full h-48 object-cover rounded-2xl mb-4"
        />
        <h3 class="text-lg font-semibold mb-2">{{ exercise.title }}</h3>
        <p class="text-gray-700 mb-2">{{ exercise.description }}</p>
        <div class="text-sm text-gray-600 mb-2">
          Schwierigkeit:
          <span class="font-medium">{{ exercise.difficulty }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExerciseList',
  props: {
    exercises: Array,
    searchQuery: String,
    selectedDifficulty: String,
  },
  computed: {
    filteredExercises() {
      return this.exercises.filter((exercise) => {
        const matchesQuery = this.searchQuery
          ? exercise.title.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true;
        const matchesDifficulty = this.selectedDifficulty
          ? exercise.difficulty === this.selectedDifficulty
          : true;
        return matchesQuery && matchesDifficulty;
      });
    },
  },
  methods: {
    viewDetails(exercise) {
      // Verwende Vue Router, um zur Detailseite zu navigieren
      this.$router.push({ name: 'ExerciseDetail', params: { id: exercise._id } });
    },
  },
};
</script>
