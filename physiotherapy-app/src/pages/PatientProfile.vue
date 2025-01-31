<template>
  <div class="flex flex-col bg-gray-200 h-screen">
    <div class="m-6 mt-16 mb-32 content-center">
      <!-- Inhalt -->
      <div class="flex flex-col bg-white rounded-2xl md:w-1/3 left-0 right-0 mx-auto p-4 shadow-md p-6 h-full">
        <div class="flex flex-col items-center justify-between mb-6">
          <div
            class="w-40 h-40 bg-secondary text-white flex items-center justify-center rounded-full font-bold text-4xl mb-6 mt-16"
          >
            {{ getInitials(getPatientName) }}
          </div>
          <h1 class="text-xl font-nunito text-gray-800">
            {{ getPatientName }}
          </h1>
        </div>
        <div class="mt-6">
          <h2 class="text-lg font-nunito text-gray-800">Fortschritt</h2>
          <p>Sitzungen abgeschlossen: 12</p>
          <p>Abzeichen erhalten: 5/10</p>
        </div>

        <div class="mt-6">
          <h2 class="text-lg font-nunito text-gray-800">Hilfe & Support</h2>
          <p class="text-gray-600">
            <a href="#" class="text-blue-500 hover:underline"
              >Häufig gestellte Fragen</a
            >
          </p>
          <p class="text-gray-600">
            <a href="#" class="text-blue-500 hover:underline"
              >Kontakt zum Support</a
            >
          </p>
        </div>
        <button
          @click="logout"
          class="bg-white border border-red-500 hover:bg-red-600 text-red-500 font-bold py-2 px-6 rounded-full shadow-md mt-16"
        >
          Ausloggen
        </button>
      </div>
    </div>
    <!-- Navigationsleiste -->
    <NavBar />
  </div>
</template>

<script>
import NavBar from "../components/patient/NavBar.vue";

export default {
  name: "PatientProfile",
  components: {
    NavBar,
  },
  computed: {
    getPatientName() {
      // Ersetzt dies mit dem tatsächlichen Wert aus dem Store oder einer API
      return this.$store.state.patientName || "Patient";
    },
  },
  methods: {
    getInitials(name) {
      if (!name) return "P";
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    },
    logout() {
      localStorage.removeItem('token'); // Entfernt das gespeicherte Token
      this.$router.push('/login'); // Leitet zur Login-Seite weiter
    }
  },
};
</script>

<style scoped></style>
