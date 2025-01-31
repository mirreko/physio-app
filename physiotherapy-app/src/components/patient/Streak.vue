<template>
  <div class="bg-white md:w-2/3 left-0 right-0 mx-auto rounded-2xl flex items-center justify-between p-4 mt-2 shadow-md md:pt-6 md:pb-6">
    <div class="flex-1 ml-4">
      <div class="w-full bg-gray-300 h-4 rounded-full relative">
        <div
          class="bg-primary h-4 rounded-full"
          :style="{ width: `${Math.min(getStreak * 10, 100)}%` }"
        ></div>
      </div>
      
      <div v-if="getStreak !== null">
        <div class="text-center mt-2 text-gray-700 font-semibold">
        {{ getStreak }}-Day Streak 🔥
      </div>
</div>
<div v-else>
  <!-- Ladeanzeige -->
  Lade Streak...
</div>

    </div>
  </div>
</template>


<script>
export default {
  async created() {
  const patientId = localStorage.getItem("patientId");
  if (patientId) {
    await this.$store.dispatch('fetchCurrentTrainingPlan', patientId);
    this.trainingPlan = this.getCurrentTrainingPlan;

    // Stelle sicher, dass der Streak nach dem Laden der Seite aus der DB geladen wird
    await this.$store.dispatch('fetchStreak');
  } else {
    console.error("Patient ID nicht gefunden.");
  }
},

  computed: {
    // Getter für den Streak
    getStreak() {
      return this.$store.state.streak;
    },
  },
};
</script>


<style>
/* Optional: Für zusätzliches Styling */
</style>
