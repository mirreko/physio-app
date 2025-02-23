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
        <div v-if="trainingPlan" class="flex flex-col justify-center align-center mt-4">
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
            <swiper-slide
              v-for="(exercise, index) in trainingPlan.exercises"
              :key="exercise._id"
              class="flex flex-col align-center justify-center text-start bg-white shadow-md rounded-2xl p-4 mb-6 gap-6"
            >
              <img
                :src="`${baseUrl}${exercise.exerciseId.imgUrl}`"
                alt="Exercise Image" class="w-full"
              />
              <div>
                <h3 class="text-lg font-semibold mt-4 mb-2">
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

            <swiper-slide class="swiper-no-swiping">
              <div
                class="finish-slide bg-secondary p-6 rounded-xl shadow-md flex flex-col items-center"
              >
                <h2 class="text-3xl font-nunito text-white mt-4">
                  Geschafft! 🎉
                </h2>
                <p class="text-white mt-6">Wie war dein Workout?</p>
                <div class="mt-4 w-full">
                  <label for="workout-rating" class="text-sm text-white font-bold">
                    Schwierigkeit:
                  </label>

                  <div
                    class="flex justify-between text-xs text-white mt-2 mb-2"
                  >
                    <span>Sehr Leicht</span>
                    <span>Angemessen</span>
                    <span>Sehr Schwer</span>
                  </div>

                  <div class="w-full">
                    <input
                      id="workout-rating"
                      type="range"
                      v-model="workoutRating"
                      min="0"
                      max="4"
                      step="1"
                      class="w-full mt-2 color-primary range-slider"
                    />
                  </div>

                  <div class="text-center text-sm text-white">
                    {{ workoutLabels[workoutRating] }}
                  </div>
                </div>

                <div class="mt-6">
                  <label for="pain-rating" class="text-sm text-white font-bold"
                    >Schmerzintensität (0 bis 10):</label
                  >
                  <input
                    id="pain-rating"
                    type="range"
                    v-model="painRating"
                    min="0"
                    max="10"
                    step="1"
                    class="w-full mt-2 range-slider"
                  />
                  <div class="text-center text-sm text-white">
                    {{ painRating }}
                  </div>
                </div>

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
        <div v-else class="text-gray-600 text-center p-6">
          Lade Trainingsplan...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCards } from "swiper/modules";
import { useRouter } from "vue-router";
import "swiper/swiper-bundle.css";
import confetti from "canvas-confetti";

const store = useStore();
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const trainingPlan = ref(null);
const currentExerciseIndex = ref(1);
const workoutRating = ref(2);
const painRating = ref(0);
const workoutLabels = ref([
  "Sehr Leicht",
  "Leicht",
  "Angemessen",
  "Schwer",
  "Sehr Schwer",
]);
const router = useRouter();

const modules = [EffectCards];

const getCurrentTrainingPlan = computed(
  () => store.getters.getCurrentTrainingPlan
);

const updateCurrentExercise = (swiper) => {
  const maxExercises = trainingPlan.value.exercises.length;
  currentExerciseIndex.value = Math.min(swiper.realIndex + 1, maxExercises);
};

const goToDashboard = () => {
  router.push("/patient-dashboard");
};

const completeWorkout = async () => {
  const workoutResult = {
    workoutRating: workoutRating.value,
    painRating: painRating.value,
    completedAt: new Date().toISOString(),
    patientId: localStorage.getItem("patientId"),
  };

  try {
    launchConfetti();

    await store.dispatch("markWorkoutCompleted", workoutResult);
    await store.dispatch("submitFeedback", workoutResult);

    await store.dispatch("updatePoints", 10);

    const patientId = localStorage.getItem("patientId");
    await store.dispatch("updateStreak", { patientId, newStreak: store.state.streak});

    const response = await fetch(
      `${baseUrl}/api/users/${patientId}/check-badges`,
      { method: "POST" }
    );

    const { newBadges } = await response.json();

    if (newBadges && newBadges.length > 0) {
      alert(
        `Herzlichen Glückwunsch! Du hast ${newBadges.length} neue Badges verdient! 🎉`
      );
      router.push("/patient-dashboard");
    } else {
      router.push("/patient-dashboard");
    }
  } catch (error) {
    console.error("Fehler beim Abschließen des Workouts:", error);
    alert("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
  }
};

const launchConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });

  const duration = 2 * 1000;
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
    } else {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }
  }, 250);
};

onMounted(async () => {
  const patientId = localStorage.getItem("patientId");
  if (patientId) {
    await store.dispatch("fetchCurrentTrainingPlan", patientId);
    trainingPlan.value = getCurrentTrainingPlan.value;
  } else {
    console.error("Patient ID nicht gefunden.");
  }
});
</script>

<style scoped>
.range-slider {
    -webkit-appearance: none;
    width: 100%;
    height: 8px;
    background: #ddd; 
    border-radius: 5px;
    outline: none;
    transition: background 0.3s;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: theme('colors.primary'); 
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  transition: background 0.3s;
}

.range-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4f46e5; 
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    transition: background 0.3s;
}
</style>