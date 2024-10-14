<template>
    <aside class="bg-background m-4 rounded-2xl">
      <ul class="p-6">
        <li class="mb-6">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Übung suchen..."
            class="p-2 border rounded-full w-full mb-4"
            @input="updateSearchQuery"
          />
          <select v-model="selectedDifficulty" @change="updateSelectedDifficulty" class="p-2 border rounded-full w-full">
            <option value="">Alle Schwierigkeitsgrade</option>
            <option value="leicht">Leicht</option>
            <option value="mittel">Mittel</option>
            <option value="schwer">Schwer</option>
          </select>
        </li>
        <li class="mb-4">
        <a href="#" class="text-lg font-semibold hover:text-gray-400"
          >Extremität</a
        >
      </li>
      <li class="mb-4">
        <a href="#" class="text-lg font-semibold hover:text-gray-400"
          >Krankheitsbilder</a
        >
      </li>
      <li class="mb-4">
        <a href="#" class="text-lg font-semibold hover:text-gray-400"
          >Wundheilungsphase</a
        >
        <label class="block pt-4">
          <input type="checkbox" value="Entzündungsphase" v-model="selectedWoundHealing" class="mr-2" />
          Entzündungsphase
        </label>
        <label class="block pt-4">
          <input type="checkbox" value="Proliferationsphase" v-model="selectedWoundHealing" class="mr-2" />
          Proliferationsphase
        </label>
        <label class="block pt-4">
          <input type="checkbox" value="Umbauphase" v-model="selectedWoundHealing" class="mr-2" />
          Umbauphase
        </label>
      </li>
      <li class="mb-4">
        <a href="#" class="text-lg font-semibold hover:text-gray-400"
          >Woche post OP</a
        >
        <label class="block pt-4">
          <input type="checkbox" value="1" v-model="selectedPostOpWeeks" class="mr-2" />
          1. Woche post OP
        </label>
        <label class="block pt-4">
          <input type="checkbox" value="2" v-model="selectedPostOpWeeks" class="mr-2" />
          2. Woche post OP
        </label>
        <label class="block pt-4">
          <input type="checkbox" value="3" v-model="selectedPostOpWeeks" class="mr-2" />
          3. Woche post OP
        </label>
        <label class="block pt-4">
          <input type="checkbox" value="4" v-model="selectedPostOpWeeks" class="mr-2" />
          4. bist 8. Woche post OP
        </label>
      </li>
      </ul>
    </aside>
  </template>
  
  <script>
  export default {
    name: "Sidebar",
    data() {
        return {
      searchQuery: "",
      selectedDifficulty: "",
      selectedExtremities: [],
      selectedDiseases: [],
      selectedWoundHealing: [],
      selectedPostOpWeeks: [],
    };
    },
    methods: {
      updateSearchQuery() {
        this.$emit("update:search-query", this.searchQuery);
      },
      updateSelectedDifficulty() {
        this.$emit("update:selected-difficulty", this.selectedDifficulty);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Custom Styles */
  </style>
  