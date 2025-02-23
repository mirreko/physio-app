<template>
  <div class="p-6 bg-background rounded-2xl">
    <div class="text-xl font-nunito mb-4">Bitte wählen Sie eine Person aus</div>

    <div class="mb-4">
      <span
        v-for="letter in alphabet"
        :key="letter"
        class="cursor-pointer mx-1 underline underline-offset-2 hover:text-primary"
        @click="filterPatientsByLetter(letter)"
      >
        {{ letter }}
      </span>
    </div>

    <button
      v-if="selectedLetter"
      class="mb-4 p-btn bg-primary text-white rounded-full"
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
      <h3 class="text-lg font-bold">Übungsplan erstellen für:</h3>
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
      patients: [],
      selectedPatient: null,
      selectedLetter: "", 
      alphabet: Array.from(Array(26)).map((_, i) => String.fromCharCode(i + 65)), // A-Z
    };
  },
  computed: {
    filteredPatients() {
    
    let nonPhysioPatients = this.patients.filter(
      (patient) => patient.isPhysiotherapist === false
    );
   
    if (this.selectedLetter) {
      nonPhysioPatients = nonPhysioPatients.filter(
        (patient) =>
          patient.name.charAt(0).toUpperCase() === this.selectedLetter
      );
    } else {
      nonPhysioPatients = nonPhysioPatients.slice(-6).reverse();
    }
    return nonPhysioPatients;
  },
  },
  async created() {
    await this.fetchPatients(); 
  },
  methods: {
    async fetchPatients() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`);
        this.patients = await response.json();
      } catch (error) {
        console.error("Fehler beim Abrufen der Patienten:", error);
      }
    },
    ...mapActions(["selectPatient"]),
    handleSelectPatient(patient) {
      this.selectPatient(patient); 
      this.selectedPatient = patient;
    },
    getInitials(name) {
      const names = name.split(" ");
      const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
      return initials;
    },
    filterPatientsByLetter(letter) {
      this.selectedLetter = letter; 
    },
    resetFilter() {
      this.selectedLetter = ""; 
    },
  },
};
</script>
