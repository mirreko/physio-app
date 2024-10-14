<template>
    <div class="p-6 bg-background rounded-2xl m-6 w-full">
      <h1 class="text-2xl font-bold mb-4">Alle Trainingspläne</h1>
      <div v-if="trainingPlans.length === 0" class="text-gray-600">
        Keine Trainingspläne gefunden.
      </div>
      <div v-else class="mb-6 ">
        <div
          v-for="plan in trainingPlans"
          :key="plan._id"
          class=" flex flex-row justify-between bg-white border rounded-lg p-4"
        >
          <h2 class="font-medium">Patient: {{ plan.patientName }}</h2>
          <ul>
            <li v-for="exercise in plan.exercises" :key="exercise.exerciseId">
              Übung: {{ exercise.title }} Wiederholungen: {{ exercise.repetitions }} Sätze: {{ exercise.sets }} Dauer: {{ exercise.duration }} Minuten
            </li>
          </ul>
          <button class="bg-secondary text-white p-btn rounded-full" @click="$emit('delete-plan', plan._id)">Löschen</button>
          <button class="bg-secondary text-white p-btn rounded-full" @click="$emit('delete-plan', plan._id)">Bearbeiten</button>
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
};
</script>
