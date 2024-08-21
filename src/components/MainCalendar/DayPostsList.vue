<script setup>
import Post from '../Post.vue';
import emitter from '@/plugins/EmitterPlugin';

const props = defineProps({
  posts: { type: Object }
});

function postClick(id) {
  emitter.emit('postSelected', id);
}
</script>

<template>
  <div class="bg-white rounded-xl flex-1 mb-10 flex flex-wrap w-full justify-between">
    <div v-show="posts?.length === 0" class="text-center opacity-40 py-20 m-auto">
      Публикаций не запланированно
    </div>

    <div
      v-show="posts?.length"
      class="grid grid-cols-1 lg:grid-cols-2 items-baseline p-6 md:p-10 w-full space-y-4"
    >
      <Post
        @click="() => postClick(post.id)"
        class="basis-4/5 sm:basis-3/5 md:basis-2/5"
        :key="post.name"
        :postObject="post"
        v-for="post of posts ?? []"
      />
    </div>
  </div>
</template>
