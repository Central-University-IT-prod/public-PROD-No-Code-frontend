<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  name: String,
  path: String
})

const route = useRoute()

const active = computed(() => {
  return route.path.slice(0, 4) === props.path.slice(0, 4);
})
</script>

<template>
  <router-link :to="path">
    <h2 class="inline mx-4 font-normal  md:left-0" :class="{ mbl: active }">{{ name }}</h2>
  </router-link>
</template>