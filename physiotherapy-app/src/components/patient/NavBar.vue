<template>
  <div
    class="fixed bottom-0 bg-white m-4 mb-10 h-16 w-11/12 shadow-2xl rounded-2xl flex items-center justify-around z-10"
  >
    <!-- Home Icon -->
    <div
      class="relative flex flex-col items-center w-16 bg-secondary text-white rounded-full h-16 flex items-center justify-center -top-4"
    >
      <i class="fas fa-home text-2xl"></i>
    </div>
    <!-- Awards Icon -->
    <div class="flex flex-col items-center">
      <i class="fas fa-award text-2xl"></i>
    </div>
    <!-- Statistics Icon -->
    <div class="flex flex-col items-center">
      <i class="fa-solid fa-chart-line text-2xl"></i>
    </div>
    <!-- Profile Icon -->
    <div class="flex flex-col items-center">
      <i class="fas fa-user text-2xl"></i>
    </div>
  </div>
</template>

<script>
import "@fortawesome/fontawesome-free/css/all.css";

export default {
  name: "BottomNavBar",
};
</script>
