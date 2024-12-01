<template>
  <div class="bg-white rounded-2xl flex items-center justify-between p-4 mt-2 shadow-md">
    <div class="flex-1 ml-4">
      <div class="w-full bg-gray-300 h-4 rounded-full relative">
        <div
          class="bg-primary h-4 rounded-full"
          :style="{ width: `${Math.min(getStreak * 10, 100)}%` }"
        ></div>
      </div>
      <div class="text-center mt-2 text-gray-700 font-semibold">
        {{ getStreak }}-Day Streak 🔥
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getStreak']),
  },
  created() {
  const patientId = localStorage.getItem('patientId');
  if (!patientId) {
    console.error('Patient ID nicht gefunden.');
    return;
  }

  this.$store.dispatch('fetchStreak');
}

};
</script>


<style>
/* Optional: Für zusätzliches Styling */
</style>
