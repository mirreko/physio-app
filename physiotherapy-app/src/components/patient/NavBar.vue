<template>
    <div class="fixed bottom-24 bg-white m-4 h-16 w-11/12 shadow-2xl rounded-2xl flex items-center justify-around z-10">
        <div class="flex flex-col items-center">
      <i class="fas fa-award text-2xl"></i>
    </div>
    <!-- Plan Icon -->
    <div class="relative flex flex-col items-center w-16 bg-secondary text-white rounded-full h-16 flex items-center justify-center -top-4">
      <i class="fas fa-calendar-alt text-2xl"></i>
    </div>
    <!-- Profile Icon -->
    <div class="flex flex-col items-center ">
      <i class="fas fa-user text-2xl"></i>
    </div>
    </div>
</template>
  
  <script>
  import '@fortawesome/fontawesome-free/css/all.css';
  
  export default {
    name: 'BottomNavBar',
  };
  </script>
  