<template>
  <div
    class="fixed bottom-0 bg-white m-4 mb-10 h-16 w-11/12 shadow-2xl rounded-2xl flex items-center justify-around z-10"
  >
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="relative flex flex-col items-center w-16 text-gray-700"
      :class="{ 'bg-secondary text-white rounded-full h-16 flex items-center justify-center -top-4': $route.path === item.path }"
    >
      <i :class="item.icon" class="text-2xl"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navItems: [
        { path: '/patient-dashboard', icon: 'fas fa-home' },
        { path: '/badges', icon: 'fas fa-award' },
        { path: '/statistics', icon: 'fa-solid fa-chart-line' },
        { path: '/profile', icon: 'fas fa-user' },
      ],
    };
  },
};
</script>
