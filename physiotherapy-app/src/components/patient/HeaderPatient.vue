<template>
  <header class="flex bg-white p-4 flex justify-between items-center">
    <h2 class="text-xl md:text-2xl font-bold text-gray-800">
      Hallo, {{ getPatientName }}!
    </h2>
    <div class="w-12 h-12 bg-secondary text-white flex items-center justify-center rounded-full font-bold">
      {{ getInitials(getPatientName) }}
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "HeaderPatient",
  computed: {
    ...mapGetters(['getPatientName']),
  },
  methods: {
    getInitials(name) {
      // Teile den Namen in Worte und nimm die ersten Buchstaben der ersten und zweiten Worte
      return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2); // nur die ersten zwei Initialen
    },
  },
};
</script>

<style scoped>
/* Custom Styles */
</style>
