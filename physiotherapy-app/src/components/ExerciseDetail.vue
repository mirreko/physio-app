<template>
  <div class="exercise-detail pl-6">
    <button class="bg-secondary text-white p-btn rounded-full" @click="goBack">Zurück</button>
    <div class="p-6 bg-background rounded-2xl mt-6 flex flex-row">
      <div class="flex-1 p-4 flex flex-col justify-between">
    <h1 class="text-2xl font-bold mb-4">{{ exercise.title }}</h1>
    <img :src="exercise.image" alt="Exercise Image" class="w-full h-48 object-cover rounded-2xl mb-4"/>
    <div class="text-sm text-gray-600 mb-2">Schwierigkeit: <span class="font-medium">{{ exercise.difficulty }}</span></div>
      </div>
      <div class="flex-1 p-4 flex flex-col justify-between">
    <p class="text-gray-700 mb-4">{{ exercise.description }}</p>

    <div class="mb-4">
      <label for="repetitions" class="block text-gray-600">Wiederholungen:</label>
      <input
        id="repetitions"
        type="number"
        v-model="editedExercise.repetitions"
        class="border rounded p-2 w-auto"
      />
    </div>

    <div class="mb-4">
      <label for="duration" class="block text-gray-600">Dauer (in Minuten):</label>
      <input
        id="duration"
        type="number"
        v-model="editedExercise.duration"
        class="border rounded p-2 w-auto"
      />
    </div>

    <div class="mb-4">
      <label for="sets" class="block text-gray-600">Sätze:</label>
      <input
        id="sets"
        type="number"
        v-model="editedExercise.sets"
        class="border rounded p-2 w-auto"
      />
    </div>

    <div class="flex justify-start"> 
        <button @click="saveToTrainingPlan" class="bg-primary text-white p-btn rounded-full">Hinzufügen</button>
      </div>
  </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ExerciseDetail',
  data() {
    return {
      exercise: {},
      editedExercise: {
        repetitions: 0,
        duration: 0,
        sets: 0,
      },
    };
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const response = await fetch(`http://localhost:5500/api/exercises/${id}`);
      this.exercise = await response.json();
      
      // Setze die Standardwerte für die bearbeitete Übung
      this.editedExercise.repetitions = this.exercise.repetitions || 0;
      this.editedExercise.duration = this.exercise.duration || 0;
      this.editedExercise.sets = this.exercise.sets || 0;
    } catch (error) {
      console.error('Fehler beim Laden der Übung:', error);
    }
  },
  computed: {
  ...mapGetters(['getSelectedPatient']),
},

  methods: {
    goBack() {
      this.$router.go(-1);
    },
    
    async saveToTrainingPlan() {
  const patient = this.getSelectedPatient;

  if (!patient) {
    alert('Bitte wählen Sie einen Patienten aus.');
    return;
  }

  const patientId = patient._id;
  const patientName = patient.name;

  try {
    const response = await fetch('http://localhost:5500/api/trainingplans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId,
        patientName,
        exerciseId: this.exercise._id,
        repetitions: this.editedExercise.repetitions,
        duration: this.editedExercise.duration,
        sets: this.editedExercise.sets,
      }),
    });

    if (!response.ok) {
      throw new Error('Netzwerkantwort war nicht ok');
    }

    alert('Trainingsplan erfolgreich gespeichert!');
  } catch (error) {
    console.error('Fehler beim Speichern des Trainingsplans:', error);
  }
}

  },
};
</script>

<style scoped>
/* Hier können deine Styles für die Detailseite sein */
</style>
