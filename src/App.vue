<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import ApplicationHeader from './components/Header/ApplicationHeader.vue';
import { useWindowSize } from '@vueuse/core';
import { provide } from 'vue';

const store = useStore();
const router = useRouter();

const loaded = ref(false);

const isMobileVersion = computed(() => {
  const { width, height } = useWindowSize();
  const MobileMaxWidth = 768;
  return width.value <= MobileMaxWidth;
});
onMounted(async () => {
  await store.dispatch('UserModule/initUserByToken');
  if (store.state.UserModule.User === null) {
    router.push('/auth');
  }
  loaded.value = true;
});
provide('isMobileVersion', isMobileVersion);
</script>

<template>
  <div v-if="loaded">
    <application-header v-show="store.state.UserModule.User" />
    <RouterView />
  </div>
</template>
