<template>
  <div class="bg-white p-2 rounded-2xl flex items-center justify-center shadow-md h-full">
    <div class="flex flex-col items-center justify-center">
      <div class="text-xs">Noch</div>
      <div class="text-4xl font-bold">{{ remainingWorkouts }}</div>
      <div class="text-xs">Workouts</div>
      <div class="text-xs">diese Woche</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "WorkoutCounter",
  computed: {
    ...mapGetters(['getRemainingWorkouts']),
    
    remainingWorkouts() {
      return this.getRemainingWorkouts || 0;
    },
  },
  methods: {
    ...mapActions(['markWorkoutCompleted']),
  },
};
</script>
