<template>
    <div class="flex flex-row justify-between items-center mt-6 mb-2">
        <p class="text-md">Abzeichen <span class="text-primary text-xl">8</span>/32</p>
        <p class="text-md text-secondary underline">Alle Abzeichen</p>
    </div>
    <div class="bg-white rounded-2xl p-4 shadow-md mt-2 mb-32">
    <ul class="grid grid-cols-3 gap-6 sm:grid-cols-2 xs:grid-cols-1">
    <li v-for="badge in badges.slice(0, 3)" :key="badge._id" class="flex flex-col items-center text-center">
  <img :src="badge.imageUrl" alt="Badge Icon" class="w-20 h-20" />
  <p class="text-sm">{{ badge.name }}</p>
</li>
</ul>
</div>
  </template>
  
  <script>
  export default {
    name: "Badge",
    data() {
    return {
      badges: [],
    };
  },
  async mounted() {
  try {
    const response = await fetch("http://localhost:5500/api/badges");
    if (!response.ok) {
      throw new Error(`HTTP-Error: ${response.status}`);
    }
    const badges = await response.json();
    this.badges = badges; // Badges in deiner Komponente speichern
  } catch (err) {
    console.error("Fehler beim Abrufen der Badges:", err.message);
  }
},
   
    };
  
  </script>
  
  <style scoped>
 
  </style>
  