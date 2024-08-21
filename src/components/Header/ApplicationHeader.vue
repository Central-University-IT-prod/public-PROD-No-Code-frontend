<script setup>
import { ref } from 'vue';
import { navRoutes } from '../../router/router';
import NavItem from './NavItem.vue';
import NavMenu from './NavMenu.vue';

const isMenuActive = ref(false);

const openMenu = () => {
  isMenuActive.value = true;
};

const closeMenu = () => {
  isMenuActive.value = false;
};
</script>

<template>
  <header
    class="z-50 sticky top-0 left-0 w-screen px-5 py-4 2xl:py-10 flex items-center bg-background-1000"
  >
    <router-link to="/">
      <h1><span class="mbl">Prod</span>вижение</h1>
    </router-link>

    <nav class="flex-1 items-center hidden md:flex ml-20">
      <nav-item
        :name="navRoute.name"
        :path="navRoute.path"
        v-for="navRoute in navRoutes"
        :key="navRoute.name"
      />
    </nav>

    <nav-menu @close-menu="closeMenu" :active="isMenuActive" />

    <button @click="openMenu" class="flex flex-1 justify-end md:hidden">
      <i class="pi pi-bars text-2xl"></i>
    </button>
  </header>
</template>
