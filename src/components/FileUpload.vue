<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { videoAccept, imageAccept, documentAccept } from '../constants/CreateConstants';
const props = defineProps(['type', 'id']);
const emit = defineEmits(['fileRead']);
const accept = ref();
const toast = useToast();
switch (props.type) {
  case 'photo':
    accept.value = imageAccept;
    break;
  case 'video':
    accept.value = videoAccept;
    break;
  default:
    accept.value = documentAccept;
    break;
}

function handleFileInputChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();

  reader.onload = () => {
    const base64String = reader.result;
    if (base64String === '' || !base64String) {
      emptyFile();
      return;
    }
    emit('fileRead', base64String);
  };
  reader.readAsDataURL(file);
  e.target.value = null;
}

function emptyFile() {
  toast.add({
    severity: 'error',
    summary: 'Пустой файл',
    detail: 'Данных в файле не обнаружено',
    life: 3000
  });
}
</script>

<template>
  <div class="flex items-center h-full">
    <slot></slot>
    <input class="hidden" :accept="accept" type="file" @change="handleFileInputChange" />
  </div>
</template>
