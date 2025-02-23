<template>
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <div class="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 class="text-2xl font-bold mb-6 text-center">Registrieren</h2>
      <form @submit.prevent="registerUser">
        <div class="mb-4">
          <label for="name"class="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" v-model="name" class="mt-1 p-2 border rounded w-full"required />
        </div>
        <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">E-Mail</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="mt-1 p-2 border rounded w-full"
              required
            />
        </div>
            <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Passwort</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="mt-1 p-2 border rounded w-full"
              required
            />
        </div>
        <div class="mb-4">
          <label for="role">Sind Sie Physiotherapeut?</label>
          <select v-model="isPhysiotherapist" required>
            <option :value="true">Ja</option>
            <option :value="false">Nein</option>
          </select>
        </div>
        <button
            type="submit"
            class="bg-primary text-white w-full p-2 rounded-full font-semibold"
          >
            Registrieren
          </button>
      </form>
    </div>
    </div>

  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        isPhysiotherapist: false, 
      };
    },
    methods: {
      async registerUser() {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/authRoutes/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: this.name,
              email: this.email,
              password: this.password,
              isPhysiotherapist: this.isPhysiotherapist,
            }),
          });
  
          if (!response.ok) {
            throw new Error('Registrierung fehlgeschlagen');
          }
  
          const data = await response.json();
          alert('Registrierung erfolgreich!');
  
          localStorage.setItem('authToken', data.token);
          this.redirectToDashboard(this.isPhysiotherapist);
        } catch (error) {
          console.error(error);
          alert('Fehler bei der Registrierung. Bitte versuchen Sie es erneut.');
        }
      },
      redirectToDashboard(isPhysiotherapist) {
        if (isPhysiotherapist) {
          this.$router.push('/physio-dashboard');
        } else {
          this.$router.push('/patient-dashboard');
        }
      },
    },
  };
  </script>

  