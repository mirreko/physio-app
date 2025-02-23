<template>
  <div class="flex flex-col">
    <Header class="w-full p-6 sticky top-0" />
    <div class="flex flex-1">
      <TrainingsplanList
        :trainingPlans="trainingPlans"
        @planDeleted="fetchTrainingPlans"
      />
    </div>
  </div>
</template>

<script>
import Header from "../components/physio/Header.vue";
import TrainingsplanList from "../components/physio/TrainingsplanList.vue";

export default {
  name: "Trainingplans",
  components: {
    Header,
    TrainingsplanList,
  },
  data() {
    return {
      trainingPlans: [], 
    };
  },
  async created() {
    await this.fetchTrainingPlans(); 
  },
  methods: {
    async fetchTrainingPlans() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/trainingplans`);
        this.trainingPlans = await response.json();
      } catch (error) {
        console.error("Fehler beim Abrufen der Trainingspläne:", error);
      }
    },
  },
  mounted() {
    this.fetchTrainingPlans();
  },
};
</script>
