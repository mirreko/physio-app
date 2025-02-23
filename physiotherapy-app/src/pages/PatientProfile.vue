<template>
  <div class="flex flex-col bg-gray-200">
    <div class="m-6 mt-16 mb-32 content-center">
      <div
        class="flex flex-col bg-white rounded-2xl xl:w-1/3 lg:w-2/3 md:w-2/3 sm:2/3 left-0 right-0 mx-auto p-4 shadow-md p-6 h-full"
      >
        <div class="flex flex-col items-center justify-between mb-6">
          <div
            class="w-32 h-32 bg-secondary text-white flex items-center justify-center rounded-full font-bold text-4xl mb-6 mt-10"
          >
            {{ getInitials(getPatientName) }}
          </div>
          <h1 class="text-xl font-nunito text-gray-800">
            {{ getPatientName }}
          </h1>
        </div>
        <div class="mt-8">
          <h2 class="text-lg font-nunito text-gray-800">Fortschritt</h2>
          <p class="text-sm text-gray-600 mb-2">
            Erhalte hier eine Übersicht, über deine bereits geschafften
            Leistungen.
          </p>
          <p>Sitzungen abgeschlossen: {{ getStreak }}</p>
          <p>
            Abzeichen erhalten:
            <span class="text-primary text-xl">{{ userBadges.length }}</span>
            /{{ allBadges.length }}
          </p>
        </div>

        <div class="mt-6">
          <h2 class="text-lg font-nunito text-gray-800">Recovery Tipps</h2>
          <p class="text-sm text-gray-600">
            Sammle genug Punkte durch Workouts, um hier neue nützliche Tipps
            freizuschalten. Pro 50 Punkte gibt es einen neuen Tipp!
          </p>
          <ul class="mt-4 grid grid-cols-3 md:grid-cols-4 gap-6">
            <li
              v-for="(tip, index) in tips"
              :key="index"
              class="relative w-20 h-20 mx-auto border rounded-2xl flex items-center justify-center text-gray-500 cursor-pointer"
              :class="{
                'border-gray-300 bg-gray-100': !isTipUnlocked(index),
                'bg-secondary': canUnlockTip(index),
                'bg-primary': isTipUnlocked(index),
              }"
              @click="handleTipClick(index)"
            >
              <span v-if="isTipUnlocked(index)">✅</span>
              <span class="text-2xl" v-else-if="canUnlockTip(index)">🔓</span>
              <span class="text-2xl" v-else>🔒</span>
            </li>
          </ul>
        </div>

        <div class="mt-8">
          <h2 class="text-lg font-nunito text-gray-800">Persönliche Daten</h2>
          <p>Email: user@example.com</p>
          <p>Passwort: ********</p>
        </div>

        <div class="mt-6">
          <h2 class="text-lg font-nunito text-gray-800">Hilfe & Support</h2>
          <p class="text-gray-600">
            <a href="#" class="text-blue-500 hover:underline"
              >Häufig gestellte Fragen</a
            >
          </p>
          <p class="text-gray-600">
            <a href="#" class="text-blue-500 hover:underline"
              >Kontakt zum Support</a
            >
          </p>
        </div>
        <button
          @click="logout"
          class="bg-white border border-red-500 hover:bg-red-600 hover:text-white text-red-500 font-bold py-2 px-6 rounded-full shadow-md mt-16"
        >
          Ausloggen
        </button>
      </div>
    </div>
    <NavBar />

    <div
      v-if="selectedTip !== null"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="closeTipDetail"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4 relative"
      >
        <button
          @click="closeTipDetail"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
        <h2 class="text-lg font-semibold text-center text-secondary mt-4 mb-4">
          💡 Recovery Tip
        </h2>
        <h3 class="text-xl font-semibold text-center mt-4 mb-4">
          {{ tips[selectedTip].title }}
        </h3>
        <p class="text-sm text-gray-600 text-center mb-4">
          {{ tips[selectedTip].description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/patient/NavBar.vue";
import { mapState } from "vuex";

export default {
  name: "PatientProfile",
  components: {
    NavBar,
  },
  data() {
    return {
      unlockedTips: [],
      selectedTip: null,
      tips: [
        {
          title: "Kleine Bewegungen, große Wirkung",
          description:
            "Auch kleine Bewegungen zählen! Selbst wenn du an einem Tag nicht dein volles Programm schaffst, kann schon eine kurze Dehnung oder ein Spaziergang helfen, den Heilungsprozess zu unterstützen.",
        },
        {
          title: "Auf deine Haltung achten",
          description:
            "Eine gesunde Körperhaltung ist der Schlüssel zur Schmerzlinderung! Achte darauf, nicht zu lange in einer Position zu verharren – besonders beim Sitzen. Nutze kleine Bewegungspausen zwischendurch.",
        },
        {
          title: "Atmung und Entspannung",
          description:
            "Tiefes Atmen kann Verspannungen lösen und die Durchblutung fördern. Probiere eine tiefe Bauchatmung: 4 Sekunden einatmen, 6 Sekunden ausatmen. Dies hilft dir, während des Trainings entspannt zu bleiben.",
        },
        {
          title: "Regelmäßigkeit schlägt Intensität",
          description:
            "Besser täglich ein bisschen, als einmal pro Woche viel. Dein Körper braucht gleichmäßige Impulse, um sich zu regenerieren. Plane feste Zeiten für dein Training ein – und feiere auch kleine Fortschritte!",
        },
        {
          title: "Schmerzen richtig deuten",
          description:
            "Ein leichtes Ziehen ist okay, aber starke Schmerzen sind ein Zeichen, langsamer zu machen. Dein Körper gibt dir Signale – höre darauf! Falls du unsicher bist, sprich mit deinem Therapeuten.",
        },
        {
          title: "Mehr Wasser, mehr Beweglichkeit",
          description:
            "Wusstest du, dass ausreichend Wasser hilft, deine Muskeln geschmeidiger zu halten? Dein Körper braucht Flüssigkeit für die Regeneration – also immer schön hydrieren! 🚰",
        },
        {
          title: "Alltag in Bewegung verwandeln",
          description:
            "Nutze kleine Chancen zur Bewegung: Während du telefonierst, im Stehen arbeiten, beim Zähneputzen auf einem Bein balancieren. Jede Bewegung hilft!",
        },
        {
          title: "Gutes Equipment, besseres Training",
          description:
            "Ein geeigneter Untergrund und die richtigen Schuhe können dein Training effektiver und angenehmer machen. Falls du oft auf hartem Boden trainierst, probiere eine weiche Matte aus.",
        },
        {
          title: "Mentale Einstellung zählt!",
          description:
            "Visualisiere deinen Erfolg. Stell dir vor, wie du stärker und beweglicher wirst. Dein Gehirn verarbeitet diese Bilder und hilft dir, motivierter zu bleiben.",
        },
        {
          title: "Fortschritt dokumentieren",
          description:
            "Manchmal sieht man Verbesserungen nicht sofort. Notiere deine Erfolge oder mache Fotos/Videos deiner Übungen. Du wirst überrascht sein, wie weit du schon gekommen bist! 📈",
        },
        {
          title: "Aufwärmen nicht vergessen!",
          description:
            "Ein kurzes Aufwärmen vor deinem Training bereitet deine Muskeln und Gelenke optimal vor. Dynamische Bewegungen wie Armkreisen oder sanftes Dehnen können helfen, Verletzungen zu vermeiden und deine Leistung zu steigern.",
        },
        {
          title: "Erholung ist genauso wichtig wie Training",
          description:
            "Dein Körper braucht Zeit zur Regeneration! Achte darauf, genug Schlaf zu bekommen und Pausen zwischen den Trainingseinheiten einzuplanen. Aktive Erholung wie leichtes Stretching oder ein Spaziergang kann ebenfalls helfen.",
        },
      ],
    };
  },

  created() {
    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      this.$store.dispatch("fetchUserBadges", { patientId });
      this.$store.dispatch("fetchStreak");
    }
    this.$store.dispatch("fetchAllBadges");
    this.$store.dispatch("fetchUserPoints");
  },
  computed: {
    ...mapState(["points"]),

    getPatientName() {
      return this.$store.state.patientName || "Patient";
    },
    userBadges() {
      return this.$store.getters.getUserBadges;
    },
    allBadges() {
      return this.$store.state.allBadges || [];
    },
    getStreak() {
      return this.$store.state.streak;
    },
  },
  methods: {
    getInitials(name) {
      if (!name) return "P";
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    canUnlockTip(index) {
      return (
        (this.points || 0) >= (index + 1) * 50 && !this.isTipUnlocked(index)
      );
    },
    handleTipClick(index) {
      if (this.canUnlockTip(index)) {
        this.unlockedTips.push(index);
      }
      if (this.isTipUnlocked(index)) {
        this.selectedTip = index;
      }
    },
    isTipUnlocked(index) {
      return this.unlockedTips.includes(index);
    },
    closeTipDetail() {
      this.selectedTip = null;
    },
  },
};
</script>

<style scoped></style>
