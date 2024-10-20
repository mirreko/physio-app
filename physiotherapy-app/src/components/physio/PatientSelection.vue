<template>
  <div class="p-6 bg-background rounded-2xl">
    <h2 class="text-2xl font-bold mb-4">Bitte wählen Sie eine Person aus</h2>

    <!-- Buchstaben Filter -->
    <div class="mb-4">
      <span
        v-for="letter in alphabet"
        :key="letter"
        class="cursor-pointer mx-1 font-bold underline underline-offset-2 hover:text-primary"
        @click="filterPatientsByLetter(letter)"
      >
        {{ letter }}
      </span>
    </div>

    <!-- Reset Button -->
    <button
      v-if="selectedLetter"
      class="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      @click="resetFilter"
    >
      Filter zurücksetzen
    </button>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="patient in filteredPatients"
        :key="patient._id"
        :class="[
          'flex items-center border rounded-2xl p-4 cursor-pointer hover:bg-gray-100',
          {
            'bg-blue-100 border-blue-400':
              selectedPatient && selectedPatient._id === patient._id,
          },
        ]"
        @click="handleSelectPatient(patient)"
      >
        <div
          class="w-12 h-12 bg-secondary text-white flex items-center justify-center rounded-full font-bold mr-4"
        >
          {{ getInitials(patient.name) }}
        </div>
        <div>
          <h3 class="font-medium">{{ patient.name }}</h3>
          <p class="text-sm text-gray-600">{{ patient.details }}</p>
        </div>
      </div>
    </div>

    <div v-if="selectedPatient" class="mt-6">
      <h3 class="text-lg font-bold">Ausgewählter Patient:</h3>
      <p>{{ selectedPatient.name }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      patients: [], // Array für die Patienten
      selectedPatient: null, // Der aktuell ausgewählte Patient
      selectedLetter: "", // Der aktuell ausgewählte Buchstabe
      alphabet: Array.from(Array(26)).map((_, i) => String.fromCharCode(i + 65)), // A-Z
    };
  },
  computed: {
    filteredPatients() {
      // Filter Patienten basierend auf dem ausgewählten Buchstaben
      if (this.selectedLetter) {
        return this.patients.filter(patient => patient.name.charAt(0).toUpperCase() === this.selectedLetter);
      }
      // Wenn kein Buchstabe ausgewählt ist, die letzten 6 Patienten zurückgeben
      return this.patients.slice(-6).reverse();
    },
  },
  async created() {
    await this.fetchPatients(); // Patienten abrufen, wenn die Komponente erstellt wird
  },
  methods: {
    async fetchPatients() {
      try {
        const response = await fetch("http://localhost:5500/api/users");
        this.patients = await response.json();
      } catch (error) {
        console.error("Fehler beim Abrufen der Patienten:", error);
      }
    },
    ...mapActions(["selectPatient"]),
    handleSelectPatient(patient) {
      this.selectPatient(patient); // Den Patienten im Store speichern
      this.selectedPatient = patient; // Setze den ausgewählten Patienten lokal
    },
    getInitials(name) {
      const names = name.split(" ");
      const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
      return initials;
    },
    filterPatientsByLetter(letter) {
      this.selectedLetter = letter; // Setze den aktuell ausgewählten Buchstaben
    },
    resetFilter() {
      this.selectedLetter = ""; // Setze den ausgewählten Buchstaben zurück
    },
  },
};
</script>

<style scoped>
/* Hier können deine Styles für das Dashboard sein */
</style>
