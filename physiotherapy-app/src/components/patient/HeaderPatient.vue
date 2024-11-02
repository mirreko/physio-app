<template>
  <header class="flex bg-white p-4 flex justify-between items-center">
    <h2 class="text-xl md:text-2xl font-bold text-gray-800">
      Hallo, {{ getPatientName }}!
    </h2>
    <img
      src="https://placehold.co/40x40"
      alt="Profilbild"
      class="rounded-full w-10 h-10"
    />
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "HeaderPatient",
  computed: {
    ...mapGetters(['getPatientName']),
  },
};
</script>

<style scoped>
/* Custom Styles */
</style>
