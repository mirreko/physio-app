<template>
  <header class="flex bg-transparent p-4 flex gap-4 items-center">
    <div 
      class="w-12 h-12 bg-secondary text-white flex items-center justify-center rounded-full font-bold cursor-pointer" 
      @click="toggleTooltip"
    >
      {{ getInitials(getPatientName) }}
    </div>
    <h1 class="text-xl md:text-2xl font-nunito text-gray-800">
      Hallo, {{ getPatientName }}!
    </h1>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "HeaderPatient",
  computed: {
    ...mapGetters(['getPatientName']),
  },
  data() {
    return {
      isTooltipVisible: false,
    };
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
