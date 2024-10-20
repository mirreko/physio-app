<template>
    <div class="flex flex-col">
      <Header class="w-full p-6 sticky top-0" />
      <div class="flex flex-1">
        <main class="flex-1 p-6 min-h-screen">
          <h2 class="text-2xl font-bold mb-4">Willkommen, Patient!</h2>
          <Streak />
          <ExerciseCard />
          
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import ExerciseCard from '../components/patient/ExerciseCard.vue';
  import Header from '../components/physio/Header.vue';
  import Streak from '../components/patient/Streak.vue';

  
  export default {
    name: 'PatientDashboard',
    components: {
      Header,
      ExerciseCard,
      Streak,
    }
  };
  </script>
  