<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">Anmeldung</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700"
            >E-Mail</label
          >
          <input
            v-model="email"
            type="email"
            id="email"
            class="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Passwort</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            class="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <button
          class="bg-primary text-white w-full p-2 rounded-full font-semibold" @click="login()"
        >
          Anmelden
        </button>
        <div class="flex justify-center mt-4">
          <router-link
            to="/register"
            class="text-sm underline underline-offset-4"
            >Noch keinen Account? Hier registrieren.</router-link
          >
        </div>
      </form>
      <div v-if="errorMessage" class="text-red-500 text-sm mt-4">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: null,
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch(
          "http://localhost:5500/api/authRoutes/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Ungültige Anmeldedaten");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token); 

        // Um Benutzerrolle abfragen
        const userResponse = await fetch(
          "http://localhost:5500/api/authRoutes/user",
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Fehler beim Abrufen der Benutzerinformationen");
        }
        
        const user = await userResponse.json();

        console.log(user);
        
        if (user.isPhysiotherapist === false && user._id) { // Angenommen, die Benutzerinformationen enthalten die Rolle und die patientId
      localStorage.setItem("patientId", user._id); // Speichern der patientId
    }

        // Benutzerrolle und Dashboard weiterleiten
        this.redirectToDashboard(user.isPhysiotherapist); // Verwende die Rolle hier
        
      } catch (error) {
        this.errorMessage =
          "Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Daten.";
      }
    },

    redirectToDashboard(isPhysiotherapist) {
      if (isPhysiotherapist) {
        this.$router.push("/physio-dashboard"); // Weiterleitung zum Physiotherapie-Dashboard
      } else {
        this.$router.push("/patient-dashboard"); // Weiterleitung zum Patienten-Dashboard
      }
    },
  },
};
</script>

<style scoped>
/* Optional: Weitere Styles für das Login-Formular */
</style>
