<template>
  <div class="bg-white p-2 rounded-2xl flex items-center justify-center shadow-md h-full">
    <div class="flex flex-col items-center justify-center">
      <div class="text-sm">🏅 Punkte</div>
      <div v-if="points !== null">
        <div class="text-4xl font-bold">{{ points }}</div>
      </div>
      <div v-else>
        <p>Lade Punkte...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Points",
  data() {
    return {
      points: null, 
    };
  },
  async created() {
    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      try {
        await this.$store.dispatch("fetchUserPoints");
        this.points = this.$store.getters.getPoints; 
      } catch (error) {
        console.error("Fehler beim Laden der Punkte:", error);
      }
    } else {
      console.error("Patient ID nicht gefunden.");
    }
  },
};
</script>
