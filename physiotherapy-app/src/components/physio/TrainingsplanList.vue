<template>
  <div class="p-6 bg-background rounded-2xl m-6 w-full">
    <h1 class="text-2xl font-bold mb-4">Alle Trainingspläne</h1>
    <p class="mb-4 text-md text-gray-600 md:text-start">
              Hier erhalten Sie eine Übersicht aller Trainingspläne, die Sie für Ihre Patient*innen erstellt haben.
            </p>
    <div v-if="trainingPlans.length === 0" class="text-gray-600">
      Keine Trainingspläne gefunden.
    </div>
    <div v-else class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="plan in trainingPlans"
          :key="plan._id"
          class="bg-white border rounded-lg p-4 flex flex-col justify-between"
        >
          <div>
            <h2 class="font-medium mb-2">Patient*in: {{ plan.patientName }}</h2>
            <ul class="exercise-overview grid grid-cols-1 2xl:grid-cols-2 gap-2">
              <li
                v-for="exercise in plan.exercises"
                :key="exercise.exerciseId"
                class="flex items-center p-4 bg-gray-100 rounded-md shadow-sm"
              >
              <img
              :src="exercise.exerciseId.imgUrl ? `${baseUrl}${exercise.exerciseId.imgUrl}` : 'https://placehold.co/600x400'"
              alt="Exercise Image"
              class="w-20 h-20 object-cover rounded-md mr-4"
            />
            <div>
              <h5 class="text-sm font-semibold">{{ exercise.title }}</h5>
              <p class="text-xs text-gray-600 mt-2">
                <b>Sätze:</b> {{ exercise.sets }} |
                <b>Wdh.:</b> {{ exercise.repetitions }}
              </p>
            </div>
                
              </li>
            </ul>
          </div>
          <div class="flex items-center justify-center gap-4 mt-4">
            <button
              class="bg-primary text-white p-btn rounded-full"
              @click="deleteTrainingPlan(plan._id)"
            >
              Löschen
            </button>
            <button
              class="bg-secondary text-white p-btn rounded-full"
              @click="$emit('edit-plan', plan._id)"
            >
              Bearbeiten
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TrainingsplanList",
  props: {
    trainingPlans: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      baseUrl: import.meta.env.VITE_API_BASE_URL
    };
  },
  methods: {
    async deleteTrainingPlan(planId) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/trainingplans/${planId}`,
          { method: "DELETE" }
        );
        if (!response.ok) {
          throw new Error("Fehler beim Löschen des Trainingsplans");
        }
        this.$emit("plan-deleted", planId);
        alert("Trainingsplan erfolgreich gelöscht!");
      } catch (error) {
        console.error("Fehler beim Löschen des Trainingsplans:", error);
      }
    },
  },
};
</script>