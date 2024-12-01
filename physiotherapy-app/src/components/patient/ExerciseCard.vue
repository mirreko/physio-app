<template>
  <div class="flex items-center justify-center h-fit mt-6"> 
    <div class="flex flex-col justify-center w-full md:w-2/3 bg-white rounded-2xl pt-4">
      <h1 class="text-xl md:text-2xl font-bold pt-6 text-center">Ihr Trainingsplan</h1>

      <div v-if="!trainingPlan" class="text-gray-600 text-center p-6">
        <strong>Kein Trainingsplan gefunden.</strong> <br> Ihr Physio hat Ihnen wahrscheinlich noch keinen Trainingsplan zugewiesen.
      </div>

      <div v-else class="flex flex-col justify-center align-center mt-4">
        <!-- Swiper für die Übungen -->
        <swiper
          :effect="'cards'"
          :grabCursor="true"
          :modules="modules"
          class="w-80 md:w-96 h-fit"
        >
          <!-- Übungen aus dem Trainingsplan -->
          <swiper-slide
            v-for="exercise in trainingPlan.exercises"
            :key="exercise._id"
            class="flex flex-col align-center justify-center text-start bg-white border rounded-2xl p-4 mb-4 gap-6"
          >
            <img
              src="https://placehold.co/600x400"
              alt="Exercise Image"
            />
            <div>
              <h3 class="text-lg font-semibold mb-2">{{ exercise.exerciseId.title }}</h3>
              <p class="text-sm text-gray-600 mb-4">{{ exercise.exerciseId.description }}</p>

              <div class="text-sm text-gray-800 space-y-2">
                <p><b>Wiederholungen:</b> {{ exercise.repetitions }}</p>
                <p><b>Sätze:</b> {{ exercise.sets }}</p>
                <p><b>Dauer:</b> {{ exercise.duration }} Sekunden</p>
              </div>
            </div>
          </swiper-slide>

          <!-- "Geschafft!"-Slide -->
          <swiper-slide>
            <div class="finish-slide bg-secondary p-6 rounded-xl shadow-md flex flex-col items-center">
              <h2 class="text-2xl font-bold text-white mt-4">Geschafft! 🎉</h2>
              <p class="text-white mt-6">Wie war dein Workout?</p>

              <!-- Slider für die Workout-Bewertung -->
              <div class="workout-slider mt-4">
                <label for="workout-rating" class="text-sm text-white">Schwierigkeit (0 bis 10):</label>
                <input
                  id="workout-rating"
                  type="range"
                  v-model="workoutRating"
                  min="0"
                  max="10"
                  step="1"
                  class="w-full mt-2"
                />
                <div class="text-center text-sm text-white">{{ workoutRating }}</div>
              </div>

              <!-- Slider für die Schmerzbewertung -->
              <div class="pain-slider mt-6">
                <label for="pain-rating" class="text-sm text-white">Schmerzintensität (0 bis 10):</label>
                <input
                  id="pain-rating"
                  type="range"
                  v-model="painRating"
                  min="0"
                  max="10"
                  step="1"
                  class="w-full mt-2"
                />
                <div class="text-center text-sm text-white">{{ painRating }}</div>
              </div>

              <!-- Abhaken Button -->
              <div class="flex justify-center m-4">
          <button @click="completeWorkout" class="bg-primary text-white p-btn rounded-full">
            Workout erledigt!
          </button>
        </div>
            </div>
          </swiper-slide>

        </swiper>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCards } from 'swiper/modules';
import 'swiper/swiper-bundle.css'; // Swiper Styles importieren
import WorkoutCounter from './WorkoutCounter.vue';

export default {
  name: "ExerciseCard",
  components: {
    Swiper,
    SwiperSlide,
    WorkoutCounter,
  },
  setup() {
    return {
      modules: [EffectCards],
    };
  },
  computed: {
    ...mapGetters(['getCurrentTrainingPlan']),

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
    ...mapActions(['markWorkoutCompleted', 'updatePoints']),
    
    completeWorkout() {
      // Daten für das abgeschlossene Workout vorbereiten
      const workoutResult = {
        workoutRating: this.workoutRating,
        painRating: this.painRating,
        completedAt: new Date().toISOString(),
      };

      // Hier sendest du die Daten an die DB
      this.markWorkoutCompleted(workoutResult);

      // Punkte um 10 erhöhen
      this.updatePoints(10);

      // Optional: Benachrichtigung oder Rückmeldung
      alert("Workout erfolgreich abgeschlossen! 🎉");
    },
  },
  data() {
    return {
      trainingPlan: null,
      workoutRating: 0, // Slider für die Bewertung des Workouts
      painRating: 0, // Slider für die Schmerzbewertung
    };
  },
  async created() {
    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      await this.$store.dispatch('fetchCurrentTrainingPlan', patientId);
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

.workout-slider, .pain-slider {
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
  background: #0FF2B2; /* Farbe des Schiebereglers */
  cursor: pointer;
  transition: background 0.3s ease;
}

</style>
