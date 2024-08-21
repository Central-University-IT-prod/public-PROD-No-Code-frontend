<script setup>
const props = defineProps(['label', 'value']);
</script>

<template>
  <div class="space-x-1">
    <span>{{ label }}</span>
    <span>{{ value }}</span>
  </div>
</template>
