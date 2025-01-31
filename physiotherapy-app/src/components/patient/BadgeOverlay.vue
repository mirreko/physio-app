<template>
  <div v-if="badges.length > 0" class="badge-overlay">
    <div class="badge-container">
      <h3 class="badge-header">Deine Badges</h3>
      <ul class="badge-list">
        <li v-for="badge in badges" :key="badge.id" class="badge-item">
          <img :src="`${baseUrl}${badge.imageUrl}`" alt="Badge" class="badge-icon" />
          <p>{{ badge.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const baseUrl = import.meta.env.VITE_API_BASE_URL;
</script>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BadgeOverlay',
  computed: {
    ...mapGetters(['getBadges']),
    badges() {
      return this.getBadges;
    },
  },
};
</script>

<style scoped>
.badge-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.badge-container {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.badge-header {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.badge-list {
  list-style-type: none;
  padding: 0;
}

.badge-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.badge-icon {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

</style>
