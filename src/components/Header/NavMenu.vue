<script setup>
import NavItem from './NavItem.vue';
import  { navRoutes } from '../../router/router'
const props = defineProps({
  active: Boolean
})

const emit = defineEmits(['closeMenu'])

const closeMenu = () => {
  emit('closeMenu')
}
</script>

<template>
  <transition name="fade">
    <div
      class="z-20 w-screen h-screen fixed left-0 top-0 duration bg-background-950 bg-opacity-5"
      @click.stop="closeMenu"
      v-show="active"
    >
      <transition name="slide-fade">
        <div
          @click.stop
          class="flex flex-col h-screen bg-white w-80 fixed right-0 top-0 p-5"
          v-show="active"
        >
          <nav-item
            :name="navRoute.name"
            :path="navRoute.path"
            v-for="navRoute in navRoutes"
            :key="navRoute.name"
            @click="closeMenu"
          />
        </div>
      </transition>
    </div>
  </transition>
</template>

<style>
</style>