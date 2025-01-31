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
              <img :src="exercise.exerciseId.imgUrl" alt="Exercise Image" />
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

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCards } from "swiper/modules";
import "swiper/swiper-bundle.css"; // Swiper Styles importieren
import WorkoutCounter from "../components/patient/WorkoutCounter.vue";
import confetti from "canvas-confetti";

export default {
  name: "WorkoutPage",
  components: {
    Swiper,
    SwiperSlide,
    WorkoutCounter,
  },
  setup() {
    return {
      modules: [EffectCards],
      swiperOptions: {
        noSwipingClass: "swiper-no-swiping",
      },
    };
  },
  computed: {
    ...mapGetters(["getCurrentTrainingPlan"]),

    calculatedCurrentWeek() {
      if (!this.trainingPlan || !this.trainingPlan.createdAt) return 0;

      const createdAt = new Date(this.trainingPlan.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - createdAt);

      const currentWeek = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      return Math.min(currentWeek, this.trainingPlan.durationWeeks || 0);
    },
  },
  methods: {
    ...mapActions(["markWorkoutCompleted", "updatePoints", "submitFeedback"]),

    updateCurrentExercise(swiper) {
      const maxExercises = this.trainingPlan.exercises.length;
      this.currentExerciseIndex = Math.min(swiper.realIndex + 1, maxExercises);
    },

    goToDashboard() {
      console.log("Go to Dashboard");
      this.$router.push("/patient-dashboard");
    },
    async completeWorkout() {
      const workoutResult = {
        workoutRating: this.workoutRating,
        painRating: this.painRating,
        completedAt: new Date().toISOString(),
        patientId: localStorage.getItem("patientId"),
      };

      try {
        // Starte Konfetti-Animation
        this.launchConfetti();

        // Hier sendest du die Daten an die DB
        this.markWorkoutCompleted(workoutResult);
        await this.$store.dispatch("submitFeedback", workoutResult);

        await this.updatePoints(10);

        const patientId = localStorage.getItem("patientId");
        const newStreak = this.$store.state.streak + 1;
        await this.$store.dispatch("updateStreak", { patientId, newStreak });

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${patientId}/check-badges`,
          {
            method: "POST",
          }
        );

        const { newBadges } = await response.json();

        if (newBadges && newBadges.length > 0) {
          alert(
            `Herzlichen Glückwunsch! Du hast ${newBadges.length} neue Badges verdient! 🎉`
          );
          this.$router.push("/patient-dashboard");
        } else {
          this.$router.push("/patient-dashboard");
          alert("Workout erfolgreich abgeschlossen! 🎉");
        }
      } catch (error) {
        console.error("Fehler beim Abschließen des Workouts:", error);
        alert("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
      }
    },

    launchConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Optional: Für längere Animation mehrere Konfetti-Schüsse
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
    },
  },
  data() {
    return {
      trainingPlan: null,
      workoutRating: 2, // Default auf "Angemessen"
      painRating: 0, // Schmerzbewertung bleibt wie vorher
      workoutLabels: [
        "Sehr Leicht",
        "Leicht",
        "Angemessen",
        "Schwer",
        "Sehr Schwer",
      ], // Neue Labels
      currentExerciseIndex: 1,
    };
  },

  async created() {
    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      await this.$store.dispatch("fetchCurrentTrainingPlan", patientId);
      this.trainingPlan = this.getCurrentTrainingPlan;
    } else {
      console.error("Patient ID nicht gefunden.");
    }
  },
};
</script>

<style scoped>
.finish-slide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.workout-slider,
.pain-slider {
  width: 100%;
}

/* Slider - Gesamte Bahn */
input[type="range"] {
  -webkit-appearance: none;
  width: 100%; /* Weite anpassen */
  height: 12px; /* Dicke der Bahn */
  background: #f2f2f2; /* Hintergrundfarbe der Bahn */
  border-radius: 8px; /* Abgerundete Ecken der Bahn */
  outline: none;
  transition: background 0.3s ease;
}

/* Slider - Schieberegler (Thumb) */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px; /* Breite des Schiebereglers */
  height: 20px; /* Höhe des Schiebereglers */
  border-radius: 50%; /* Rundes Aussehen für den Schieberegler */
  background: #0ff2b2; /* Farbe des Schiebereglers */
  cursor: pointer;
  transition: background 0.3s ease;
}

.swiper-no-swiping {
  pointer-events: auto; /* Damit Interaktionen innerhalb des Slides wie Slider funktionieren */
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    z-index: 0;
  }
}

.animation-container {
  position: fixed;
  background-color: #0ff2b2;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  animation: fadeOut 2s ease-out forwards;
  z-index: 1000;
}
</style>