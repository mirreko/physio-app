<template>
  <div class="flex flex-col bg-gray-200 overflow-x-hidden">
    <div class="md:w-2/3 left-0 right-0 mx-auto">
    <HeaderPatient class="p-6 md:w-2/3 left-0 right-0 mx-auto sticky top-0 mt-16"/>
    <div class="flex flex-1">
      <main class="flex-1 p-6 min-h-screen">
        <div class="md:w-2/3 left-0 right-0 mx-auto grid grid-cols-3 gap-2">
          <template v-if="trainingPlan">
            <ProgressBar 
              :totalWeeks="trainingPlan.durationWeeks" 
              :currentWeek="calculatedCurrentWeek"
            />
          </template>
          <Points />
          <WorkoutCounter />
        </div>
        <Streak />
        <ExerciseCard />
        <Badges />
        <BadgeOverlay />
      </main>
      <NavBar />
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import ExerciseCard from '../components/patient/ExerciseCard.vue';
import HeaderPatient from '../components/patient/HeaderPatient.vue';
import ProgressBar from '../components/patient/ProgressBar.vue';
import Streak from '../components/patient/Streak.vue';
import Points from '../components/patient/Points.vue';
import WorkoutCounter from '../components/patient/WorkoutCounter.vue';
import NavBar from '../components/patient/NavBar.vue';
import BadgeOverlay from '../components/patient/BadgeOverlay.vue';
import Badges from '../components/patient/Badges.vue';

export default {
  name: 'PatientDashboard',
  components: {
    HeaderPatient,
    ProgressBar,
    ExerciseCard,
    Streak,
    Points,
    WorkoutCounter,
    NavBar,
    BadgeOverlay,
    Badges,
  },
  computed: {
    ...mapGetters(['getCurrentTrainingPlan', 'getBadges']),
    
    trainingPlan() {
      return this.getCurrentTrainingPlan;
    },
    
    calculatedCurrentWeek() {
      if (!this.trainingPlan || !this.trainingPlan.createdAt) return 0;
      
      const createdAt = new Date(this.trainingPlan.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - createdAt);
      const currentWeek = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      return Math.min(currentWeek, this.trainingPlan.durationWeeks || 0);
    },
  },
  methods: {
    ...mapActions(['markWorkoutCompleted']),
    completeWorkout() {
      this.markWorkoutCompleted();
    },
  },
  created() {
    this.$store.dispatch('fetchCurrentTrainingPlan');
  },
};
</script>
