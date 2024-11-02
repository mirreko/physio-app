<template>
    <div class="flex items-center justify-center h-fit mt-6 "> 
        <div class="flex flex-col justify-center w-full md:w-2/3 bg-gray-100 rounded-2xl pt-4">
      <h1 class="text-xl md:text-2xl font-bold mb-4 text-center">Ihr Trainingsplan</h1>
  
      <div v-if="!trainingPlan" class="text-gray-600 text-center">
        Kein Trainingsplan gefunden.
      </div>
  
      <div v-else class="flex justify-center align-center">
        <!-- Swiper für die Übungen -->
        <swiper
        :effect="'cards'"
    :grabCursor="true"
    :modules="modules"
    class="w-80 md:w-96 h-fit"
        >
          <swiper-slide
            v-for="exercise in trainingPlan.exercises"
            :key="exercise._id" class="flex flex-col align-center justify-center text-start bg-white border rounded-2xl p-4 mb-4 gap-6"
          >
              <img
                src="https://placehold.co/600x400"
                alt="Exercise Image"
              />
              <div >
                <h3 class="text-lg font-semibold mb-2">{{ exercise.exerciseId.title }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ exercise.exerciseId.description }}</p>
  
                <div class="text-sm text-gray-800 space-y-2">
                  <p><b>Wiederholungen:</b> {{ exercise.repetitions }}</p>
                  <p><b>Sätze:</b> {{ exercise.sets }}</p>
                  <p><b>Dauer:</b> {{ exercise.duration }} Sekunden</p>
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
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { EffectCards } from 'swiper/modules';
  import 'swiper/swiper-bundle.css'; // Swiper Styles importieren
  
  export default {
    name: "ExerciseCard",
    components: {
      Swiper,
      SwiperSlide,
    },
    setup() {
      return {
        modules: [EffectCards],
      };
    },
    computed: {
      ...mapGetters(['getCurrentTrainingPlan']),
    },
    data() {
      return {
        trainingPlan: null,
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

  </style>
  