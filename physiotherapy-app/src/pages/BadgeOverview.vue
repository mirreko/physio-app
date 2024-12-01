<template>
  
  <div class="flex flex-col bg-gradient-to-b from-white to-gray-300 overflow-y-hidden">
    <HeaderPatient class="sticky top-0 mt-16"/>
    <div class="m-6">
    <p class="">Abzeichen <span class="text-primary text-xl">8</span>/32</p>
    <div class="bg-white rounded-2xl p-4 shadow-md mt-2 mb-32">
    
      <ul class="grid grid-cols-3 gap-6 sm:grid-cols-2 xs:grid-cols-1">
      <!-- Durchlaufe alle Badges und stelle sie dar -->
      <li v-for="badge in badges" :key="badge._id" class="flex flex-col items-center text-center">
        <img :src="badge.imageUrl" alt="Badge Icon" class="w-20 h-20" />
        <p class="text-sm">{{ badge.name }}</p>
      </li>
    </ul>
  </div>
</div>
</div>
  <NavBar />
</template>

<script>
import HeaderPatient from "../components/patient/HeaderPatient.vue";
import NavBar from "../components/patient/NavBar.vue";

export default {
  name: "BadgeOverview",
  components: {
    HeaderPatient,
    NavBar,
  },
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

