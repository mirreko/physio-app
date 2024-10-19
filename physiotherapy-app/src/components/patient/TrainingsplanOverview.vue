<template>
    <div class="p-6 bg-background rounded-2xl mt-6 w-full">
      <h1 class="text-2xl font-bold mb-4">Ihr Trainingsplan</h1>
      <div v-if="!trainingPlans" class="text-gray-600">
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
    props: {
        trainingPlans: {
            type: Array,
            required: true,
        },
    },
    computed: {
      ...mapGetters(['getCurrentTrainingPlan']),
    },
    data() {
      return {
        trainingPlan: null,
      };
    },
    async created() {
      await this.$store.dispatch('fetchCurrentTrainingPlan');
      this.trainingPlan = this.getCurrentTrainingPlan;
    },
  };
  </script>
  