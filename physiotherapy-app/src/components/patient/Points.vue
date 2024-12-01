<template>
  <div class="bg-white p-2 rounded-2xl flex items-center justify-center shadow-md h-full">
    <div class="flex flex-col items-center justify-center">
      <div class="text-sm">🏅 Punkte</div>
      <div v-if="points !== undefined">
      <div class="text-4xl font-bold">{{ points }}</div>
      </div>
  </div>
</div>
</template>

<script>
export default {
  name: "Points",
  data() {
    return {
      points: null, // Initialwert setzen (z. B. null oder 0)
    };
  },
  async created() {
    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      try {
        // Punkte vom Server laden
        await this.$store.dispatch("fetchUserPoints");

        // Punkte aus dem Store abrufen
        this.points = this.$store.getters.getUserPoints;
        console.log(`Punkte: ${this.points}`);
      } catch (error) {
        console.error("Fehler beim Laden der Punkte:", error);
      }
    } else {
      console.error("Patient ID nicht gefunden.");
    }
  },
};
</script>

<style scoped></style>
