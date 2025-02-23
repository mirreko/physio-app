<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50" @click.self="close">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
      <button
        @click="close"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
      >
        ×
      </button>
      <img :src="`${baseUrl}${badge.imageUrl}`" alt="Badge" class="w-24 h-24 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-center mb-2">{{ badge.name }}</h3>
      <p class="text-sm text-gray-600 text-center mb-4">{{ badge.description }}</p>

      <p
        v-if="showAwardedAt && badge.awardedAt"
        class="text-sm text-gray-500 text-center"
      >
        Erhalten am: {{ new Date(badge.awardedAt).toLocaleDateString() }}
      </p>
    </div>
  </div>
</template>

<script setup>
const baseUrl = import.meta.env.VITE_API_BASE_URL;
</script>

<script>
export default {
  name: "BadgeDetail",
  props: {
    badge: {
      type: Object,
      required: true,
    },
    showAwardedAt: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>
