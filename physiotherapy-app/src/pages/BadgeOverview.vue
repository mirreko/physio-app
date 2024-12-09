<template>
  <div class="flex flex-col bg-gray-200 overflow-y-hidden min-h-screen">
    <HeaderPatient class="p-6 sticky top-0 mt-16" />

    <div class="m-6">
      <div class="flex justify-center mb-6">
        <div
          class="bg-white shadow-lg rounded-full w-full max-w-[400px] flex relative"
        >
          <!-- Highlighter, der sowohl die Hintergrundfarbe als auch den Text mitbewegt -->
          <div
            class="absolute top-0 left-0 w-1/2 h-full bg-secondary transition-transform duration-300 flex justify-center items-center rounded-full"
            :style="{
              transform:
                activeTab === 'user' ? 'translateX(0)' : 'translateX(100%)',
            }"
          >
            <span
              class="text-white font-medium"
              :class="{
                'translate-x-[-10%]': activeTab === 'all',
              }"
            >
              {{ activeTab === "user" ? "Deine Abzeichen" : "Alle Abzeichen" }}
            </span>
          </div>

          <!-- Tab-Buttons -->
          <button
            :class="{
              'bg-secondary text-white': activeTab === 'user',
              'bg-white text-gray-400': activeTab !== 'user',
            }"
            @click="activeTab = 'user'"
            class="flex-1 py-2 rounded-full text-center font-medium transition"
          >
            Deine Abzeichen
          </button>
          <button
            :class="{
              'bg-secondary text-white': activeTab === 'all',
              'bg-white text-gray-400': activeTab !== 'all',
            }"
            @click="activeTab = 'all'"
            class="flex-1 py-2 rounded-full text-center font-medium transition"
          >
            Alle Abzeichen
          </button>
        </div>
      </div>

      <!-- User Badges -->
      <div
        v-show="activeTab === 'user'"
        class="bg-white rounded-2xl p-4 shadow-md mb-32"
      >
        <h2 class="text-xl md:text-2xl font-nunito pt-6 text-center">
          Deine Abzeichen
        </h2>
        <p class="text-center mb-6">
          Abzeichen
          <span class="text-primary text-xl">{{ userBadges.length }}</span>
          /{{ allBadges.length }}
        </p>
        <div v-if="userBadges.length === 0" class="text-center text-gray-500">
          Du hast noch keine Badges.
        </div>
        <div v-else>
          <ul class="grid grid-cols-3 gap-6 sm:grid-cols-2 xs:grid-cols-1">
            <li
              v-for="badge in userBadges"
              :key="badge.badgeId._id"
              class="cursor-pointer"
              @click="openBadgeDetail(badge.badgeId, true)"
            >
              <img
                :src="badge.badgeId.imageUrl"
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

      <!-- All Badges -->
      <div
        v-show="activeTab === 'all'"
        class="bg-white rounded-2xl p-4 shadow-md mb-32"
      >
        <h2 class="text-xl md:text-2xl font-nunito pt-6 text-center mb-6">
          Alle Abzeichen
        </h2>
        <ul class="grid grid-cols-3 gap-6 sm:grid-cols-2 xs:grid-cols-1">
          <li
            v-for="badge in allBadges"
            :key="badge._id"
            class="cursor-pointer"
            @click="openBadgeDetail(badge, true)"
          >
            <img
              :src="badge.imageUrl"
              alt="Badge Icon"
              class="w-20 h-20 mx-auto grayscale"
            />
            <p class="text-sm text-center mt-2">
              {{ badge.name }}
            </p>
          </li>
        </ul>
      </div>
    </div>

    <NavBar />

    <!-- Badge Detail Modal -->
    <BadgeDetail
      v-if="selectedBadge"
      :badge="selectedBadge"
      :showAwardedAt="showAwardedAt"
      @close="closeBadgeDetail"
    />
  </div>
</template>

<script>
import HeaderPatient from "../components/patient/HeaderPatient.vue";
import NavBar from "../components/patient/NavBar.vue";
import BadgeDetail from "../components/patient/BadgeDetail.vue";

export default {
  name: "BadgeOverview",
  components: {
    HeaderPatient,
    NavBar,
    BadgeDetail,
  },
  data() {
    return {
      activeTab: "user", // Default tab
      selectedBadge: null, // Speichert das ausgewählte Badge
      showAwardedAt: true, // Steuerung, ob "Erhalten am" angezeigt wird
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
  methods: {
    openBadgeDetail(badge, showAwardedAt) {
      this.selectedBadge = badge;
      console.log(this.selectedBadge);
      this.showAwardedAt = showAwardedAt;
    },
    closeBadgeDetail() {
      this.selectedBadge = null;
      this.showAwardedAt = false;
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
