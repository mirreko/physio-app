<template>
  <div class="p-6 bg-background rounded-2xl m-6 w-full">
    <h1 class="text-2xl font-bold mb-4">Alle Trainingspläne</h1>
    <div v-if="trainingPlans.length === 0" class="text-gray-600">
      Keine Trainingspläne gefunden.
    </div>
    <div v-else class="mb-6 ">
      <div v-for="plan in trainingPlans" :key="plan._id" class="flex flex-row justify-between bg-white border rounded-lg p-4 mb-4 gap-6">
        
        <!-- Patient Name Column -->
        <div class="flex-none w-1/6">
          <h2 class="font-medium">Patient: {{ plan.patientName }}</h2>
        </div>
        
        <!-- Exercises Column -->
        <div class="flex-1">
          <ul>
            <li v-for="exercise in plan.exercises" :key="exercise.exerciseId" class="mb-4">
              <b>Übung:</b> {{ exercise.title }} <br>Wiederholungen: {{ exercise.repetitions }} Sätze: {{ exercise.sets }} Dauer: {{ exercise.duration }} Minuten
            </li>
          </ul>
        </div>
        
        <!-- Delete Button Column -->
        <div class="flex-none items-center">
          <button class="bg-primary text-white p-btn rounded-full" @click="deleteTrainingPlan(plan._id)">Löschen</button>
          <button class="bg-secondary text-white p-btn rounded-full ml-4" @click="$emit('edit-plan', plan._id)">Bearbeiten</button>
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
    methods: {
  async deleteTrainingPlan(planId) {
    try {
      const response = await fetch(`http://localhost:5500/api/trainingplans/${planId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Fehler beim Löschen des Trainingsplans");
      }

      // Hier kannst du den Trainingsplan aus dem lokalen Zustand entfernen oder neu laden
      this.$emit('plan-deleted', planId); // Emitiere ein Event, um den Plan aus der Liste zu entfernen
      alert("Trainingsplan erfolgreich gelöscht!");
    } catch (error) {
      console.error("Fehler beim Löschen des Trainingsplans:", error);
    }
  },
}

};
</script>
