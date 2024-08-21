<script setup>
import UploadedFile from './UploadedFile.vue';
import { ref, watch } from 'vue';
import * as postApi from '../../api/PostApi';
import { useToast } from 'primevue/usetoast';
import emitter from '../../plugins/EmitterPlugin';

const toast = useToast();
const emit = defineEmits(['removeFile']);
const props = defineProps(['organizationId']);

async function uploadAttachment(fileProp) {
  const orgId = props.organizationId;

  if (!orgId) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка вложения',
      detail: 'Необходимо выбрать организацию',
      life: 3000
    });
    return;
  }

  const res = await postApi.uploadAttachment(
    [{ body: fileProp.file, isVideoNote: fileProp.note ?? false }],
    orgId
  );
  if (!res.ok) {
    toast.add({
      severity: 'error  ',
      summary: res.error.type,
      detail: res.error.data,
      life: 3000
    });
    return false;
  }

  toast.add({
    severity: 'success',
    summary: 'Вложение',
    detail: 'Вложение добавлено',
    life: 3000
  });

  const newAttachmentId = res.data[0];
  fileProp.newAttachmentId = newAttachmentId;
  return true;
}

async function getBase64() {
  const file = document.querySelector('#file').files[0];

  try {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function () {
      const fileProp = {
        file: reader.result,
        name: file.name,
        note: false
      };

      const res = await uploadAttachment(fileProp);

      if (res === true) {
        loadedFiles.value.push(fileProp);
      }
    };
    reader.onerror = function (error) {
      return;
    };
  } catch (e) {
    return;
  }
}

const onFileUploaded = (e) => {
  getBase64();
};

const removeFile = (file) => {
  const index = loadedFiles.value.findIndex((__file) => __file.name === file.name);
  if (index === -1) {
    return;
  }

  loadedFiles.value.splice(index, 1);
};

const loadedFiles = defineModel();

watch(() => loadedFiles.value.length, (val, newVal) => {
  if (val < newVal) {
    return;
  }

  emitter.on('update_note', (val) => {
    uploadAttachment(val);
    loadedFiles.value.splice(loadedFiles.value.findIndex(file => file.name === val.name), 1, val);
  })
})
</script>

<template>
  <div class="w-full">
    <div class="w-full">
      <input @input="onFileUploaded" class="inputfile" id="file" type="file" />
      <label for="file"><i class="pi pi-upload mr-3"></i>Добавить файл</label>
    </div>

    <div class="flex mt-6 flex-wrap">
      <uploaded-file
        @removeFile="removeFile(file)"
        :fileProp="file"
        :key="file.newAttachmentId"
        v-for="file in loadedFiles"
        v-model:note="file.note"
      />
    </div>
  </div>
</template>

<style scoped>
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.inputfile + label {
  font-size: 14px;
  color: white;
  background-color: var(--main-blue);
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}
</style>