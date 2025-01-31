<template>
    <div class="flex flex-row justify-between items-center mt-6 mb-2">
      <p class="text-center">
          Abzeichen
          <span class="text-primary text-xl">{{ userBadges.length }}</span>
          /{{ allBadges.length }}
        </p>
        <a href="./badges" class="text-md text-secondary underline">Alle Abzeichen</a>
    </div>
    <div class="bg-white rounded-2xl p-4 shadow-md mt-2 mb-32">
      <div v-if="userBadges.length === 0" class="text-center text-gray-500">
          Du hast noch keine Badges.
        </div>
        <div v-else>
          <ul class="grid grid-cols-3 gap-6 sm:grid-cols-2 xs:grid-cols-1">
            <li
              v-for="badge in userBadges.slice(0, 3)"
              :key="badge.badgeId._id"
            >
              <img
                :src="`${import.meta.env.VITE_API_BASE_URL}${badge.imageUrl}`"
                :alt="badge.badgeId.name"
                class="w-20 h-20 mx-auto"
              />
              <h3 class="text-sm text-center mt-2">
                {{ badge.badgeId.name }}
              </h3>
            </li>
          </ul>
        </div>
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
  computed: {
    userBadges() {
      return this.$store.getters.getUserBadges;
    },
    allBadges() {
      return this.$store.state.allBadges || [];
    },
  },
  created() {
    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      this.$store.dispatch("fetchUserBadges", { patientId });
    }
    this.$store.dispatch("fetchAllBadges");
  },
   
    };
  
  </script>
  
  <style scoped>
 
  </style>
  