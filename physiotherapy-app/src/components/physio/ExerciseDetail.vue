<template>
  <div class="exercise-detail pt-6">
    <button class="bg-secondary text-white p-btn rounded-full" @click="goBack">
      Zurück
    </button>
    <div class="p-6 bg-background rounded-2xl mt-6 mb-4">
      <!-- Titel -->
      <h1 class="text-2xl font-bold mb-4">{{ exercise.title }}</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Bild -->
      <img
        src="https://placehold.co/600x400"
        alt="Exercise Image"
        class="w-full h-auto object-cover rounded-2xl mb-4"
      />
      
      <!-- Beschreibung und Eingabefelder -->
      <p class="text-gray-700 mb-4">{{ exercise.description }}</p>
    </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="mb-4">
          <label for="repetitions" class="block text-gray-600">Wiederholungen:</label>
          <input
            id="repetitions"
            type="number"
            v-model="editedExercise.repetitions"
            class="border rounded p-2 w-full"
          />
        </div>
        <div class="mb-4">
          <label for="duration" class="block text-gray-600">Dauer (in Minuten):</label>
          <input
            id="duration"
            type="number"
            v-model="editedExercise.duration"
            class="border rounded p-2 w-full"
          />
        </div>
        <div class="mb-4">
          <label for="sets" class="block text-gray-600">Sätze:</label>
          <input
            id="sets"
            type="number"
            v-model="editedExercise.sets"
            class="border rounded p-2 w-full"
          />
        </div>
        <div class="mb-4">
          <label for="frequency" class="block text-gray-600">Häufigkeit (pro Woche):</label>
          <input
            id="frequency"
            type="number"
            v-model="editedExercise.frequency"
            class="border rounded p-2 w-full"
          />
        </div>
        <div class="mb-4">
          <label for="durationWeeks" class="block text-gray-600">Dauer (in Wochen):</label>
          <input
            id="durationWeeks"
            type="number"
            v-model="editedExercise.durationWeeks"
            class="border rounded p-2 w-full"
          />
        </div>
      </div>
      
      <!-- Buttons -->
      <div class="flex justify-start mt-4">
        <button
          @click="saveToTrainingPlan"
          class="bg-primary text-white p-btn rounded-full"
        >
          Hinzufügen
        </button>
        <button
          @click="resetTrainingPlan"
          class="bg-secondary text-white ml-4 p-btn rounded-full"
        >
          Trainingsplan beenden
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from "vuex";

export default {
  name: "ExerciseDetail",
  props: {
    exerciseId: String,
  },
  data() {
    return {
      exercise: {},
      editedExercise: {
        repetitions: 0,
        duration: 0,
        sets: 0,
        frequency: 0, // Neues Feld für Häufigkeit
        durationWeeks: 0, // Neues Feld für Dauer in Wochen
      },
    };
  },
  computed: {
    ...mapGetters(["getSelectedPatient"]),
  },
  async created() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/exercises/${this.exerciseId}`
      );
      this.exercise = await response.json();
      this.editedExercise.repetitions = this.exercise.repetitions || 0;
      this.editedExercise.duration = this.exercise.duration || 0;
      this.editedExercise.sets = this.exercise.sets || 0;
      // Initialisieren der neuen Felder, falls sie Teil der Übungsdaten sind
      this.editedExercise.frequency = this.exercise.frequency || 0;
      this.editedExercise.durationWeeks = this.exercise.durationWeeks || 0;
    } catch (error) {
      console.error("Fehler beim Laden der Übung:", error);
    }
  },
  methods: {
    goBack() {
      this.$emit("closeDetail");
    },
    async saveToTrainingPlan() {
      const patient = this.getSelectedPatient;

      if (!patient) {
        alert("Bitte wählen Sie einen Patienten aus.");
        return;
      }

      const patientId = patient._id;
      const patientName = patient.name;
      const trainingPlanId = this.$store.getters.getTrainingPlanId;

      const body = {
        patientId,
        patientName,
        exerciseId: this.exercise._id,
        title: this.exercise.title,
        repetitions: this.editedExercise.repetitions,
        duration: this.editedExercise.duration,
        sets: this.editedExercise.sets,
        frequency: this.editedExercise.frequency, // Neues Feld hinzufügen
        durationWeeks: this.editedExercise.durationWeeks, // Neues Feld hinzufügen
      };

      // Falls kein Trainingsplan existiert, erstelle einen neuen
      if (!trainingPlanId) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/trainingplans`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            }
          );

          if (!response.ok) {
            throw new Error("Netzwerkantwort war nicht ok");
          }

          const result = await response.json();
          console.log("Erstellter Trainingsplan:", result); // Debug
          this.$store.commit("setTrainingPlanId", result.trainingPlanId);

          alert("Trainingsplan erfolgreich erstellt und Übung hinzugefügt!");
        } catch (error) {
          console.error("Fehler beim Speichern des Trainingsplans:", error);
        }
      } else {
        // Falls ein Trainingsplan bereits existiert, füge die Übung hinzu
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/trainingplans/${trainingPlanId}/exercises`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            }
          );

          if (!response.ok) {
            throw new Error("Netzwerkantwort war nicht ok");
          }

          alert("Übung erfolgreich zum Trainingsplan hinzugefügt!");
        } catch (error) {
          console.error("Fehler beim Hinzufügen der Übung:", error);
        }
      }
    },
    resetTrainingPlan() {
      this.$store.commit("clearTrainingPlan");
      alert("Trainingsplan beenden.");
    },
  },
};
</script>
