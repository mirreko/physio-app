<template>
  <div
    class="bg-white md:w-2/3 left-0 right-0 mx-auto rounded-2xl flex items-center justify-between p-4 mt-2 shadow-md md:pt-6 md:pb-6"
  >
    <div class="flex-1 ml-4">
      <div class="w-full bg-gray-300 h-4 rounded-full relative">
        <div
          class="bg-primary h-4 rounded-full transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>

      <div v-if="getStreak !== null">
        <div class="text-center mt-2 text-gray-700 font-semibold">
          {{ getStreak }}-Tages Streak 🔥
        </div>
      </div>
      <div v-else>Lade Streak...</div>
    </div>
  </div>
</template>

<script>
export default {
  async created() {
    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      await this.$store.dispatch("fetchCurrentTrainingPlan", patientId);
      this.trainingPlan = this.getCurrentTrainingPlan;

      await this.$store.dispatch("fetchStreak");
    } else {
      console.error("Patient ID nicht gefunden.");
    }
  },

  computed: {
    getStreak() {
      return this.$store.state.streak || 0;
    },

    milestones() {
      return [7, 10, 20, 30, 50, 75, 100, 150, 200];
    },

    getCurrentMilestone() {
      let previousMilestone = 0;

      for (let milestone of this.milestones) {
        if (this.getStreak < milestone) {
          console.log(
            `Streak: ${this.getStreak}, Bereich: ${previousMilestone} - ${milestone}`
          );
          return {
            current: this.getStreak - previousMilestone,
            max: milestone - previousMilestone,
            previous: previousMilestone,
            next: milestone,
          };
        }
        previousMilestone = milestone;
      }

      return {
        current: this.getStreak - previousMilestone,
        max: previousMilestone,
        previous: previousMilestone,
        next: previousMilestone * 2,
      };
    },

    progressPercentage() {
      const { previous, next } = this.getCurrentMilestone;

      let range = next - previous;
      if (range <= 0) range = 1;

      let progress = Math.round(((this.getStreak - previous) / range) * 100);
      console.log(`Streak: ${this.getStreak}, Fortschritt: ${progress}%`);

      return progress;
    },
  },
};
</script>
