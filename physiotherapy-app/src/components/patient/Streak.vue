<template>
    <div class="bg-gray-100 rounded-lg p-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">{{ title }}</h2>
        <p class="text-lg text-gray-600">Aktuelle Streak: <span class="font-semibold text-blue-600">{{ streak }}</span> Tage</p>
        <p class="text-sm text-gray-500">Letzte Aktivität: {{ lastActivity }}</p>
      </div>
      <div class="streak-icon flex items-center">
        
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ExerciseCard",
   
    };
  
  </script>
  
  <style scoped>
 
  </style>
  