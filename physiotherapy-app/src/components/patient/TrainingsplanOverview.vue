<template>
  <div class="p-6 bg-background rounded-2xl mt-6 w-full">
    <h1 class="text-2xl font-bold mb-4">Dein Trainingsplan</h1>
    <div v-if="!trainingPlan" class="text-gray-600">
      Kein Trainingsplan gefunden.
    </div>
    <div v-else>
      <h2 class="font-medium">Patient: {{ trainingPlan.patientName }}</h2>
      <ul>
        <li v-for="exercise in trainingPlan.exercises" :key="exercise.exerciseId">
          <b>Übung:</b> {{ exercise.exerciseId.title }} 
          <b>Wiederholungen:</b> {{ exercise.repetitions }} 
          <b>Sätze:</b> {{ exercise.sets }} 
          <b>Dauer:</b> {{ exercise.duration }} Minuten
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "TrainingsplanOverview",
  computed: {
    ...mapGetters(['getCurrentTrainingPlan']),
  },
  data() {
    return {
      trainingPlan: null,
    };
  },
  async created() {
    // Holen der aktuellen patientId aus localStorage
    const patientId = localStorage.getItem("patientId");

    
    // Abfragen des Trainingsplans mit der patientId
    if (patientId) {
      await this.$store.dispatch('fetchCurrentTrainingPlan', patientId);
      this.trainingPlan = this.getCurrentTrainingPlan;
    } else {
      console.error("Patient ID nicht gefunden.");
    }
  },
};
</script>
