<template>
  <router-view />
</template>

<script>
import PhysioDashboard from './pages/PhysioDashboard.vue';
import PatientDashboard from './pages/PatientDashboard.vue';
import Trainingplans from './pages/Trainingplans.vue';

export default {
  name: 'App',
  components: {
    PhysioDashboard,
    PatientDashboard,
    Trainingplans,
  },
};
</script>
