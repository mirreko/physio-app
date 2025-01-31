<template>
    <div class="flex flex-col bg-gray-200 overflow-y-hidden h-screen">
      <div class="p-6 sticky top-0 mt-16"> </div>
      <div class="m-6">
        <div class="bg-white md:w-1/3 left-0 right-0 mx-auto rounded-2xl p-4 shadow-md mb-32">
          <div class="feedback-charts">
            <h2 class="text-xl md:text-2xl font-nunito pt-6 text-center  text-gray-800">Ihre Fortschritte</h2>
  
            <!-- Kombiniertes Diagramm für Wohlbefinden und Schmerzintensität -->
            <div class="mt-4 h-96">
                <LineChart class="" :data="combinedChartData" :options="chartOptions" />
              </div>
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  </template>
  
  <script>
  import { mapGetters } from "vuex";
  import { Line } from "vue-chartjs";
  import HeaderPatient from "../components/patient/HeaderPatient.vue";
  import NavBar from "../components/patient/NavBar.vue";
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
  } from "chart.js";
  
  // Registriere alle notwendigen Chart.js-Komponenten
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
  );
  
  export default {
    name: "Statistics",
    components: {
      LineChart: Line,
      HeaderPatient,
      NavBar,
    },
    computed: {
      ...mapGetters(["getFeedbacks"]),
  
      // Kombinierte Daten für das Diagramm
      combinedChartData() {
        const labels = this.getFeedbacks.map((feedback) =>
          new Date(feedback.completedAt).toLocaleDateString()
        );
        const workoutData = this.getFeedbacks.map((feedback) => feedback.workoutRating);
        const painData = this.getFeedbacks.map((feedback) => feedback.painRating);
  
        return {
          labels,
          datasets: [
            {
              label: "Schwierigkeit",
              data: workoutData,
              borderColor: "#6B71F2",
              tension: 0.4, 
            },
            {
              label: "Schmerzintensität",
              data: painData,
              borderColor: "#0FF2B2",
              fill: false,
              tension: 0.4, 
            },
          ],
        };
      },
  
      // Diagramm-Optionen
      chartOptions() {
        return {
          
            maintainAspectRatio: false,
    
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.raw + " / 10";
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                autoSkip: true,
                maxRotation: 0, // Verhindert die Rotation der Labels
                minRotation: 0,
              },
            },
            y: {
              min: 0, // Setzt den minimalen Wert der Y-Achse auf 0
              max: 10, // Setzt den maximalen Wert der Y-Achse auf 10
              reverse: true,
              ticks: {
                stepSize: 1, // Die Y-Achse zeigt Werte von 0 bis 10 in Schritten von 1

              },
            },
          },
        };
      },
    },
    async created() {
    // Feedbacks aus der Datenbank laden
    await this.$store.dispatch('fetchFeedbacks');
  },
  };
  </script>
  
  <style scoped>
 
  </style>
  