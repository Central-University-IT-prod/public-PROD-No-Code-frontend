<script setup>
import { ref } from 'vue';
const props = defineProps(['title', 'color']);
const color = ref(props.color ?? '#0FBC54');
</script>

<template>
  <div class="outline-1 outline rounded-lg p-1" :style="{ color: color, outlineColor: color }">
    {{ props.title }}
  </div>
</template>
