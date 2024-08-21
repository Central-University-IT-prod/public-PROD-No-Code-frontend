<script setup>
import { computed } from 'vue';
import Tag from './UI/Tag.vue';
import * as PostApi from '../api/PostApi';
import { useRouter } from 'vue-router';
import emitter from '../plugins/EmitterPlugin';

const router = useRouter();
const props = defineProps(['postObject']);

const uploadDate = computed(() => {
  const date = new Date(props.postObject.upload_date);
  function addZero(value) {
    return value > 9 ? value : `0${value}`;
  }
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  return `${hours}:${minutes}`;
});


const showDelete = computed(
  () => new Date(props.postObject.upload_date).getTime() >= new Date().getTime()
);

const deletePost = async () => {
  if (new Date(props.postObject.upload_date).getTime() < new Date().getTime()) {
    return;
  }

  const conf = confirm('Вы уверены, что хотите удалить пост?');

  if (conf) {
    const verdict = await PostApi.deleteById(props.postObject.id);

    if (verdict.ok) {
      location.reload();
    }
  }
};

const initEditPost = () => {
  emitter.emit('initEditPost', props.postObject);
}
</script>

<template>
  <a class="shadow-lg flex flex-col p-2 rounded-lg mr-4">
    <div class="flex justify-between w-full">
      <div class="flex items-center space-x-1 p-1 max-w-48 md:max-w-64 xl:max-w-72 overflow-x-auto">
        <img
          :key="integration.name"
          v-for="integration in postObject.integrations"
          :src="`/socialIcons/${integration.type.toLowerCase()}.svg`"
        />
        <small :key="tag" v-for="tag in postObject.tags">
          <Tag :title="tag"></Tag>
        </small>
      </div>
      <div class="flex space-x-2 hover:cursor-pointer">
        <i v-show="showDelete" @click.stop="initEditPost" class="pi pi-pencil"></i>
        <i v-show="showDelete" @click.stop="deletePost" class="pi pi-trash"></i>
      </div>
    </div>
    <div class="flex justify-between w-full space-x-2">
      <h3 class="flex space-x-3">
        <div class="text-accent-600">{{ uploadDate }}</div>
        <div
          class="max-w-24 sm:max-w-32 md:max-w-36 xl:max-w-56 2xl:max-w-80 whitespace-nowrap overflow-x-scroll p-0"
        >
          {{ postObject.name }}
        </div>
      </h3>
      <small class="flex items-center text-center"
        ><div>{{ postObject.ownerOrganisation.name }}</div></small
      >
    </div>
  </a>
</template>
