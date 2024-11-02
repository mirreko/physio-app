<template>
  <div class="flex flex-col overflow-x-hidden">
    <HeaderPatient class="p-6 sticky top-0 mt-16"/>
    <div class="flex flex-1">
      <main class="flex-1 p-6 min-h-screen">
        <div class="grid grid-cols-3 gap-6">
          <Streak />
          <div class="bg-gray-100 rounded-lg p-6"></div>
          <div class="bg-gray-100 rounded-lg p-6"></div>
        </div>
        <ExerciseCard />

      </main>
    </div>
  </div>
</template>

<script>
import ExerciseCard from '../components/patient/ExerciseCard.vue';
import HeaderPatient from '../components/patient/HeaderPatient.vue';
import Streak from '../components/patient/Streak.vue';


export default {
  name: 'PatientDashboard',
  components: {
    HeaderPatient,
    ExerciseCard,
    Streak,
  }
};
</script>