<template>
  <div
    class="bg-primary min-h-screen flex justify-center items-center overflow-hidden p-4"
  >
    <div class="absolute top-4 right-4 z-10">
      <button
        @click="goToDashboard"
        class="bg-transparent text-white p-2 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-x"
        >
          <path d="M18 6L6 18"></path>
          <path d="M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <div class="flex items-center justify-center w-full md:w-2/3 rounded-2xl">
      <div class="flex flex-col justify-center w-full rounded-2xl">
        <div v-if="!trainingPlan" class="text-gray-600 text-center p-6">
          <strong>Kein Trainingsplan gefunden.</strong> <br />
          Ihr Physio hat Ihnen wahrscheinlich noch keinen Trainingsplan
          zugewiesen.
        </div>

        <div v-else class="flex flex-col justify-center align-center mt-4">
          <!-- Swiper für die Übungen -->
          <h2
            class="text-xl md:text-2xl font-nunito pt-8 text-center text-white"
          >
            Trainingsplan
          </h2>

          <div class="text-center m-4">
            <p class="text-sm text-white">
              {{ currentExerciseIndex }} / {{ trainingPlan.exercises.length }}
            </p>
          </div>

          <swiper
            :effect="'cards'"
            :grabCursor="true"
            :modules="modules"
            class="w-80 md:w-96 h-fit"
            @slideChange="updateCurrentExercise"
          >
            <!-- Übungen aus dem Trainingsplan -->
            <swiper-slide
              v-for="(exercise, index) in trainingPlan.exercises"
              :key="exercise._id"
              class="flex flex-col align-center justify-center text-start bg-white shadow-md rounded-2xl p-4 mb-6 gap-6"
            >
              <img :src="`${baseUrl}${exercise.exerciseId.imgUrl}`" alt="Exercise Image" />
              <div>
                <h3 class="text-lg font-semibold mb-2">
                  {{ exercise.exerciseId.title }}
                </h3>
                <p class="text-sm text-gray-600 mb-4">
                  {{ exercise.exerciseId.description }}
                </p>

                <div class="text-sm text-gray-800 space-y-2">
                  <p><b>Wiederholungen:</b> {{ exercise.repetitions }}</p>
                  <p><b>Sätze:</b> {{ exercise.sets }}</p>
                  <p><b>Dauer:</b> {{ exercise.duration }} Sekunden</p>
                </div>
              </div>
            </swiper-slide>

            <!-- "Geschafft!"-Slide -->
            <swiper-slide class="swiper-no-swiping">
              <div
                class="finish-slide bg-secondary p-6 rounded-xl shadow-md flex flex-col items-center"
              >
                <h2 class="text-3xl font-nunito text-white mt-4">
                  Geschafft! 🎉
                </h2>
                <p class="text-white mt-6">Wie war dein Workout?</p>

                <!-- Slider für die Workout-Bewertung -->
                <div class="workout-slider mt-4">
                  <label for="workout-rating" class="text-sm text-white">
                    Schwierigkeit:
                  </label>
                  <div
                    class="flex justify-between text-xs text-white mt-2 mb-2"
                  >
                    <span>Sehr Leicht</span>
                    <span>Angemessen</span>
                    <span>Sehr Schwer</span>
                  </div>
                  <input
                    id="workout-rating"
                    type="range"
                    v-model="workoutRating"
                    :min="0"
                    :max="4"
                    step="1"
                    class="w-full mt-2"
                  />
                  <div class="text-center text-sm text-white">
                    {{ workoutLabels[workoutRating] }}
                  </div>
                </div>

                <!-- Slider für die Schmerzbewertung -->
                <div class="pain-slider mt-6">
                  <label for="pain-rating" class="text-sm text-white"
                    >Schmerzintensität (0 bis 10):</label
                  >
                  <input
                    id="pain-rating"
                    type="range"
                    v-model="painRating"
                    min="0"
                    max="10"
                    step="1"
                    class="w-full mt-2"
                  />
                  <div class="text-center text-sm text-white">
                    {{ painRating }}
                  </div>
                </div>

                <!-- Abhaken Button -->
                <div class="flex justify-center m-4">
                  <button
                    @click="completeWorkout"
                    class="bg-primary text-white p-btn rounded-full"
                  >
                    Workout erledigt!
                  </button>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </div>
  </div>
  <div class="animation-container"></div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCards } from "swiper/modules";
import "swiper/swiper-bundle.css"; // Importiere Swiper Styles

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const store = useStore();
const router = useRouter();

const trainingPlan = ref(null);
const workoutRating = ref(2);
const painRating = ref(0);
const currentExerciseIndex = ref(1);

const modules = [EffectCards];

const workoutLabels = [
  "Sehr Leicht",
  "Leicht",
  "Angemessen",
  "Schwer",
  "Sehr Schwer",
];

// Berechnung der aktuellen Woche
const calculatedCurrentWeek = computed(() => {
  if (!trainingPlan.value || !trainingPlan.value.createdAt) return 0;
  const createdAt = new Date(trainingPlan.value.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - createdAt);
  return Math.min(Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)), trainingPlan.value.durationWeeks || 0);
});

// Methode für Dashboard-Navigation
const goToDashboard = () => {
  router.push("/patient-dashboard");
};

// Methode zur Aktualisierung des aktuellen Trainings
const updateCurrentExercise = (swiper) => {
  const maxExercises = trainingPlan.value.exercises.length;
  currentExerciseIndex.value = Math.min(swiper.realIndex + 1, maxExercises);
};

// Trainingsplan beim Laden der Seite abrufen
onMounted(async () => {
  const patientId = localStorage.getItem("patientId");
  if (patientId) {
    await store.dispatch("fetchCurrentTrainingPlan", patientId);
    trainingPlan.value = store.getters.getCurrentTrainingPlan;
  } else {
    console.error("Patient ID nicht gefunden.");
  }
});
</script>
