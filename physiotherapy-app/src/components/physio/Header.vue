<template>
    <header class="bg-white">
      <div class="container mx-auto flex justify-between">
        <div class="text-3xl font-nunito align-center">PhysioTool</div>
        <nav>
          <ul class="flex space-x-4 items-center">
            <router-link to="/physio-dashboard" class="hover:text-primary">Dashboard</router-link>
            <router-link to="/trainingplans" class="hover:text-primary">Trainingspläne</router-link>
            <li><a href="#" class="hover:text-primary">PatientInnen</a></li>
            <div>
      <button @click="logout" class="bg-secondary text-white p-btn rounded-full">Logout</button>
    </div>
          </ul>
        </nav>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'Header',
    methods: {
    logout() {
      localStorage.removeItem('token'); // Entfernt das gespeicherte Token
      this.$router.push('/login'); // Leitet zur Login-Seite weiter
    }
  }
  };
  </script>
  
  <style scoped>
  /* Custom Styles */
  </style>
  