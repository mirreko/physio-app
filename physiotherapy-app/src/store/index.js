import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import { createRouter, createWebHistory } from "vue-router";

function getStartOfCurrentWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(now.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

const store = createStore({
  state: {
    selectedPatient: null,
    trainingPlanId: null,
    trainingPlan: null,
    patientName: "",
    weeklyWorkoutsRemaining: null,
    lastResetDate: null,
    points: 0,
    streak: null,
    feedbacks: [],
    userBadges: [],
    allBadges: [],
    badges: [],
  },
  mutations: {
    setSelectedPatient(state, patient) {
      state.selectedPatient = patient;
    },
    setTrainingPlanId(state, trainingPlanId) {
      state.trainingPlanId = trainingPlanId;
    },
    clearTrainingPlan(state) {
      state.trainingPlanId = null;
      state.weeklyWorkoutsRemaining = null;
      state.lastResetDate = null;
    },
    SET_CURRENT_TRAINING_PLAN(state, trainingPlan) {
      state.trainingPlan = trainingPlan;
      const trainingPlanId = trainingPlan._id;
      state.trainingPlanId = trainingPlanId;
    
      const patientId = state.selectedPatient?.id;
      const savedData = localStorage.getItem(`workoutData_${patientId}`);
    
      const currentStartOfWeek = getStartOfCurrentWeek();
      const savedStartOfWeek = new Date(
        localStorage.getItem(`startOfWeek_${patientId}`)
      );
    
      if (savedData) {
        const { weeklyWorkoutsRemaining, lastResetDate, streak } =
          JSON.parse(savedData);
    
        if (!savedStartOfWeek || currentStartOfWeek > savedStartOfWeek) {
          state.weeklyWorkoutsRemaining = trainingPlan.frequency;
          state.lastResetDate = new Date();
          state.streak = streak || 0; 
          
          localStorage.setItem(
            `startOfWeek_${patientId}`,
            currentStartOfWeek.toISOString()
          );
        } else {
          state.weeklyWorkoutsRemaining = weeklyWorkoutsRemaining;
          state.lastResetDate = lastResetDate;
          state.streak = streak || 0; 
        }
      } else if (trainingPlan.frequency) {
        state.weeklyWorkoutsRemaining = trainingPlan.frequency;
        state.lastResetDate = new Date();
    
        const fallbackStreak = state.streak || 0;
        state.streak = fallbackStreak;
    
        localStorage.setItem(
          `startOfWeek_${patientId}`,
          currentStartOfWeek.toISOString()
        );
      }
    
      this.commit("SAVE_WORKOUT_DATA");
    },
    

    SAVE_WORKOUT_DATA(state) {
      const patientId = state.selectedPatient?.id;

      if (!patientId) return;

      const data = {
        weeklyWorkoutsRemaining: state.weeklyWorkoutsRemaining,
        lastResetDate: state.lastResetDate,
        streak: state.streak, 
      };

      localStorage.setItem(`workoutData_${patientId}`, JSON.stringify(data));
    },

    setPatientName(state, name) {
      state.patientName = name;
    },
    DECREMENT_WORKOUT_COUNT(state) {
      if (state.weeklyWorkoutsRemaining > 0) {
        state.weeklyWorkoutsRemaining -= 1;
        this.commit("SAVE_WORKOUT_DATA");
      }
    },
    SET_POINTS(state, points) {
      state.points = points;
      this.commit("SAVE_POINTS");
    },
    UPDATE_POINTS(state, points) {
      state.points += points;
    },
    SAVE_POINTS(state) {
      const patientId = state.selectedPatient?.id;
      if (patientId) {
        localStorage.setItem(`points_${patientId}`, state.points);
      }
    },
    SET_STREAK(state, streak) {
      state.streak = streak;
    },
    UPDATE_STREAK(state, newStreak) {
      state.streak = newStreak;
      this.commit("SAVE_WORKOUT_DATA"); 
    },
    addFeedback(state, feedback) {
      state.feedbacks.push(feedback);
    },
    setFeedbacks(state, feedbacks) {
      state.feedbacks = feedbacks;
    },
    SET_USER_BADGES(state, badges) {
      state.userBadges = badges;
    },
    SET_ALL_BADGES(state, badges) {
      state.allBadges = badges;
    },
    SET_BADGES(state, badges) {
      state.badges = badges;
    },
    ADD_BADGE(state, badge) {
      state.badges.push(badge);
    },
  },

  actions: {
    selectPatient({ commit }, patient) {
      commit("setSelectedPatient", patient);
    },
    async fetchCurrentTrainingPlan({ commit }) {
      const patientId = localStorage.getItem("patientId");
      if (!patientId) {
        console.error("Patient ID nicht gefunden.");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/trainingplans/${patientId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        commit("SET_CURRENT_TRAINING_PLAN", data[0]);
        commit("SET_POINTS", data[0].points || 0); 
      } catch (error) {
        console.error("Fehler beim Abrufen des Trainingsplans:", error);
      }
    },

    async markWorkoutCompleted({ commit, state, dispatch }) {
      commit("DECREMENT_WORKOUT_COUNT");

      const trainingPlanId = state.trainingPlanId;
      const patientId = localStorage.getItem("patientId");

      if (!trainingPlanId || !patientId) {
        console.error("Trainingsplan oder Patient ID fehlt.");
        return;
      }

      try {
        await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/trainingplans/${trainingPlanId}/workouts`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ frequency: state.weeklyWorkoutsRemaining }),
          }
        );

        const newStreak = state.streak + 1;
        await dispatch("updateStreak", { patientId, newStreak });

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${patientId}/check-badges`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        if (data.newBadges.length > 0) {
          console.log("Neue Badges erhalten:", data.newBadges);
          await dispatch("fetchNewBadges", patientId);
          console.log("Badges aktualisiert");
        }
      } catch (error) {
        console.error("Fehler beim Abschließen des Workouts:", error);
      }
    },

    async fetchUserPoints({ commit }) {
      const patientId = localStorage.getItem("patientId");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${patientId}/points`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        commit("SET_POINTS", data.points);
      } catch (error) {
        console.error("Fehler beim Abrufen der Punkte:", error);
      }
    },
    updatePoints({ commit, state }, points) {
      commit("SET_POINTS", points);
      const patientId = localStorage.getItem("patientId");
      if (patientId) {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${patientId}/points`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ points }),
        })
          .then((response) => {
            if (!response.ok)
              throw new Error("Fehler beim Aktualisieren der Punkte");
          })
          .catch((error) => {
            console.error("Fehler beim Synchronisieren der Punkte", error);
          });
      }
    },
    async fetchStreak({ commit }) {
      try {
        const patientId = localStorage.getItem("patientId");
        if (!patientId) {
          throw new Error("Patient ID nicht gefunden.");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${patientId}/streak`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Fehler beim Abrufen des Streaks.");
        }

        const data = await response.json();
        commit("SET_STREAK", data.streak);
      } catch (error) {
        console.error("Fehler beim Abrufen des Streaks:", error);
      }
    },
    async updateStreak({ commit }, { patientId, newStreak }) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${patientId}/streak`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ streak: newStreak }),
          }
        );

        if (!response.ok)
          throw new Error("Fehler beim Aktualisieren der Streak.");

        const data = await response.json();
        commit("SET_STREAK", data.streak); 
      } catch (error) {
        console.error("Fehler beim Aktualisieren der Streak:", error);
      }
    },
    async fetchFeedbacks({ commit }) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/feedbacks`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Feedbacks");
        }
        const feedbacks = await response.json();
        commit("setFeedbacks", feedbacks);
      } catch (error) {
        console.error("Fehler beim Laden der Feedbacks:", error);
      }
    },

    async submitFeedback({ commit }, feedback) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/feedback`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, 
            },
            body: JSON.stringify(feedback),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Fehler beim Senden:", response.status, errorText);
        }

        const data = await response.json();

        commit("addFeedback", feedback); 
      } catch (error) {
        console.error("Fehler beim Senden des Feedbacks:", error);
      }
    },

    async fetchUserBadges({ commit }, { patientId }) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/${patientId}/badges`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            `Fehler beim Abrufen der Benutzer-Badges: ${response.status}`
          );
        }
        const badges = await response.json();
        if (Array.isArray(badges)) {
          commit("SET_USER_BADGES", badges);
        } else {
          console.warn(
            "Benutzer-Badges sind in keinem gültigen Array-Format:",
            badges
          );
          commit("SET_USER_BADGES", []); 
        }
      } catch (error) {
        console.error("Fehler beim Laden der Benutzer-Badges:", error);
        commit("SET_USER_BADGES", []);
      }
    },

    async fetchAllBadges({ commit }) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/badges`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });

        if (!response.ok) {
          throw new Error(`Fehler beim Abrufen der Badges: ${response.status}`);
        }

        const badges = await response.json();
        commit("SET_ALL_BADGES", badges);
      } catch (error) {
        console.error("Fehler beim Abrufen aller Badges:", error.message);
        commit("SET_ALL_BADGES", []); 
      }
    },

    async fetchNewBadges({ commit }, patientId) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${patientId}/check-badges`, {
          method: "POST",
        });
    
        const { newBadges } = await response.json();
        if (newBadges && newBadges.length > 0) {
          commit("SET_BADGES", newBadges);  
          return newBadges;
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Badges:", error);
        return [];
      }
    },    
    
  },

  getters: {
    getSelectedPatient(state) {
      return state.selectedPatient;
    },
    getPoints(state) {
      return state.points;
    },
    getUserBadges(state) {
      return state.userBadges;
    },
    allBadges(state) {
      return state.allBadges;
    },
    getTrainingPlanId: (state) => state.trainingPlanId,
    getCurrentTrainingPlan: (state) => state.trainingPlan,
    getPatientName: (state) => state.patientName,
    getRemainingWorkouts: (state) => state.weeklyWorkoutsRemaining,
    getStreak: (state) => state.streak,
    getFeedbacks: (state) => state.feedbacks,
    getBadges(state) {
      return state.badges;
    },
  },
  plugins: [
    createPersistedState({
      paths: [
        "patientName",
        "selectedPatient",
        "weeklyWorkoutsRemaining",
        "points",
        "streak",
        "badges",
      ],
    }),
  ],
});

export default store;