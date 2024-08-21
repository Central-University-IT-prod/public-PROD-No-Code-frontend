<script setup>
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
</script>


<template>
  <div
    class="absolute rounded-xl w-full h-full bg-black bg-opacity-5 left-0 top-0 z-10 flex items-center justify-center"
  >
    <MoonLoader :color="'black'" />
  </div>
</template>