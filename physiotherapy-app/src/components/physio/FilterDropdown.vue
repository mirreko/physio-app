<template>
    <select v-model="selected" @change="updateSelected" class="p-input border rounded-full w-full">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </template>
  
  <script>
  export default {
    props: {
      options: {
        type: Array,
        required: true
      },
      value: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        selected: this.value
      };
    },
    methods: {
      updateSelected() {
        this.$emit('input', this.selected);
      }
    },
    watch: {
      value(newValue) {
        this.selected = newValue;
      }
    }
  };
  </script>
  