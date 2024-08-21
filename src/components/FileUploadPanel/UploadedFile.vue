<script setup>
import { computed, ref, watch } from 'vue';
import emitter from '../../plugins/EmitterPlugin';

const props = defineProps({
  fileProp: { type: Object }
});

const emit = defineEmits(['removeFile']);

const removeFile = () => {
  emit('removeFile', props.fileProp);
};

const resolution = computed(() => props.fileProp?.name?.split('.')[1]);
const isPhoto = computed(() => ['png', 'jpg', 'gif', 'svg'].includes(resolution.value));
const isVideo = computed(() => ['mp4'].includes(resolution.value));

const superName = computed(() => {
  if (props.fileProp.name?.length > 20) {
    return props.fileProp.name.slice(0, 17) + '.' + resolution.value;
  }

  return props.fileProp.name;
});

const note = ref(null);

watch(
  () => note.value,
  (val) => {
    setTimeout(() => emitter.emit('update_note', {...props.fileProp, note: note.value}), 0);
  }
);
</script>


<template>
  <div
    class="border px-4 py-2 rounded-xl flex justify-center flex-col w-32 md:w-52 mr-4 mb-4 relative"
  >
    <button>
      <i pi pi-times></i>
    </button>
    <small class="text-center mb-3 flex items-center justify-center break-keep"
      >{{ superName }} <button><i @click="removeFile" class="pi pi-times ml-2"></i></button
    ></small>
    <img v-if="isPhoto" :src="fileProp?.file" class="w-full h-full" />

    <div class="border pb-1 rounded-md bg-background-200 flex pt-1 pl-2" v-if="isVideo">
      <input type="checkbox" class="mr-2" v-model="note" id="chb" />
      <small><label for="chb">Отправить как кружок</label></small>
    </div>
  </div>
</template>