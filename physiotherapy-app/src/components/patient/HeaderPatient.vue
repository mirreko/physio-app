<template>
  <header class="flex bg-transparent p-4 flex justify-between items-center">
    <h1 class="text-2xl md:text-2xl font-nunito text-gray-800">
      Hallo, {{ getPatientName }}!
    </h1>
    <div class="relative">
    <div 
      class="w-12 h-12 bg-secondary text-white flex items-center justify-center rounded-full font-bold cursor-pointer" 
      @click="toggleTooltip"
    >
      {{ getInitials(getPatientName) }}
    </div>

    <!-- Tooltip -->
    <div 
      v-if="isTooltipVisible" 
      class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg"
    >
      <button 
        @click="logout" 
        class="w-full text-center px-4 py-2 hover:bg-gray-100 text-red-700"
      >
        Logout
      </button>
    </div>
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
    toggleTooltip() {
      this.isTooltipVisible = !this.isTooltipVisible; // Tooltip ein-/ausblenden
    },
    logout() {
      console.log("User logged out!"); // Logout-Logik implementieren
      localStorage.removeItem('token'); // Entfernt das gespeicherte Token
      this.$router.push('/login');
    },
  
  },
};
</script>

<style scoped>
/* Custom Styles */
</style>
