<template>
  <div class="flex items-center justify-center h-fit mt-6">
    <div class="flex flex-col justify-center w-full md:w-2/3 bg-white rounded-2xl shadow-md">
      <h2 class="text-xl md:text-2xl font-nunito pt-8 text-center text-gray-800">
        Trainingsplan
      </h2>
      <div v-if="!trainingPlan" class="text-gray-600 text-center p-6">
        <strong>Kein Trainingsplan gefunden.</strong> <br />
        Ihr Physio hat Ihnen wahrscheinlich noch keinen Trainingsplan
        zugewiesen.
      </div>
      <div v-else class="text-gray-800 p-6 space-y-6">
        <p class="text-sm text-gray-600">
              Hier ist eine Übersicht über die Übungen, die dich heute erwarten.
            </p>
        <ul class="exercise-overview space-y-4">
          <li
            v-for="exercise in trainingPlan.exercises"
            :key="exercise._id"
            class="flex items-center p-4 bg-gray-100 rounded-md shadow-sm"
          >
            <img
              :src="exercise.exerciseId.imgUrl"
              alt="Exercise Image"
              class="w-20 h-20 object-cover rounded-md mr-4"
            />
            <div>
              <h5 class="text-sm font-semibold">{{ exercise.exerciseId.title }}</h5>
              <p class="text-xs text-gray-600 mt-2">
                <b>Sätze:</b> {{ exercise.sets }} |
                <b>Wdh.:</b> {{ exercise.repetitions }}
              </p>
            </div>
          </li>
        </ul>
        <div class="flex justify-center mt-6">
          <button @click="startWorkout" class="bg-primary text-white p-btn rounded-full">
            Training starten
          </button>
        </div>
      </div>
      <!-- Start-Animation -->
      <div v-if="isTransitioning" class="start-animation"></div>
    </div>
  </div>
</template>


<script>

export default {
  name: "ExerciseCard",
  data() {
    return {
      trainingPlan: null,
      isWorkoutActive: false, // Zustand für das Workout
      isTransitioning: false,
    };
  },
  methods: {
    startWorkout() {
    this.isTransitioning = true;
    setTimeout(() => {
      this.$router.push("/workout");
    }, 1000); // Wartezeit für die Animation
  },

  },
  async created() {
    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      await this.$store.dispatch("fetchCurrentTrainingPlan", patientId);
      this.trainingPlan = this.$store.getters.getCurrentTrainingPlan;
    } else {
      console.error("Patient ID nicht gefunden.");
    }
  },
};
</script>

<style scoped>
/* Custom Styles */
@keyframes spreadOut {
  0% {
    transform: scale(0);

  }
  100% {
    transform: scale(50); /* Groß genug, um den gesamten Bildschirm zu bedecken */
 
  }
}

.start-animation {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background-color: #0ff2b2;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: spreadOut 0.25s ease-out forwards;
  z-index: 1000;
}

</style>