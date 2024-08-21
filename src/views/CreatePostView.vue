<script setup>
import { ref, onMounted, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import MultiSelect from 'primevue/multiselect';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Editor from 'primevue/editor';
import Dialog from 'primevue/dialog';
import { postLimitations, prefefinedTags, timeOffset } from '../constants/CreateConstants';
import FileUpload from '../components/FileUpload.vue';
import * as meApi from '../api/MeApi';
import * as orgApi from '../api/OrganizationsApi';
import * as postApi from '../api/PostApi';
import DynamicInput from '@/components/UI/DynamicInput.vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Stepper from 'primevue/steps';
import EmojiMenu from '../components/UI/EmojiMenu.vue';
import FileUploadPanel from '../components/FileUploadPanel/FileUploadPanel.vue';
import emitter from '../plugins/EmitterPlugin';

const toast = useToast();
const router = useRouter();

const postData = ref({
  name: '',
  body: '',
  uploadAt: new Date(),
  integrationIds: [],
  tags: [],
  organizationId: 0,
  attachments: []
});

const organizationsData = ref(null);
const integrationsData = ref(null);
const showPreviewDialog = ref(false);

const stepperItems = ref([
  {
    label: 'Метаданные'
  },
  {
    label: 'Интеграции'
  },
  {
    label: 'Содержание'
  }
]);
const activeStepperStage = ref(0);

function validateData() {
  let detailText;
  if (Object.keys(postData.value.organizationId) === 0) {
    detailText = 'Компания не выбрана.';
  } else if (!postData.value.uploadAt) {
    detailText = 'Дата отправки не установлена';
  } else if (postData.value.uploadAt <= new Date()) {
    detailText = 'Запланировать пост можно только на будущее';
  } else if (
    postData.value.body.length < postLimitations.body.min ||
    postData.value.body.length > postLimitations.body.max
  ) {
    detailText = `Максимальная длина поста не корректа. Возможная длина: ${postLimitations.body.min}-${postLimitations.body.max}`;
  } else if (postData.value.integrationIds.length === 0) {
    detailText = 'Каналы для отправки не выбраны.';
  } else if (
    postData.value.name.length < postLimitations.name.min ||
    postData.value.name.length > postLimitations.name.max
  ) {
    detailText = `Название поста должна быть в промежутке ${postLimitations.name.min}-${postLimitations.name.max}`;
  }
  if (detailText) {
    toast.add({
      severity: 'warn',
      summary: 'Неверный формат',
      detail: detailText,
      life: 3000
    });
    return false;
  }
  return true;
}
async function createPost() {
  const success = validateData();
  if (!success) return;

  const uploadData = { ...postData.value };
  uploadData.uploadAt = convertToUTCPlus3(uploadData.uploadAt);

  uploadData.body = uploadData.body.replaceAll('<p>', '').replaceAll('</p>', '');
  uploadData.body = uploadData.body.replaceAll('<br>', '\n');

  uploadData.attachments = uploadData.attachments.map(attachment => attachment.newAttachmentId);

  const res = await postApi.create(uploadData);
  if (!res.ok) return;
  router.push('/home/');
}

function convertToUTCPlus3(date) {
  const utcTime = date.getTime();
  const dateOffset = date.getTimezoneOffset();

  const shift = (dateOffset + timeOffset) * 60 * 1000;

  const utcPlus3Time = utcTime + shift;

  return utcPlus3Time;
}

async function orgSelected() {
  integrationsData.value = (await orgApi.getIntegrations(postData.value.organizationId)).data;
}

const previewIntegration = ref(null);

async function createPreview() {
  const uploadData = { ...postData.value };

  uploadData.body = uploadData.body.replaceAll('<p>', '').replaceAll('</p>', '');
  uploadData.body = uploadData.body.replaceAll('<br>', '\n');
;
  uploadData.attachments = uploadData.attachments.map(attachment => attachment.newAttachmentId);

  const res = await postApi.preview({ ...uploadData, integrationId: previewIntegration.value });

  if (res.ok) {
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: 'Тестовая публикация отправлена',
      life: 3000
    });
  } else {
    toast.add({
      severity: 'error',
      summary: res.error.type,
      detail: res.error.data,
      life: 3000
    });
  }
}

onMounted(async () => {
  organizationsData.value = (await meApi.getOrganizations()).data;
});

const showEmojiMenu = ref(false);


const isEdit = ref(false);
emitter.on('init-edit', (data) => {
  isEdit.value = true;
  postData.value.attachments = data.attachments;
})
</script>

<template>
  <main class="h-2/3 flex space-y-10 flex-col justify-around">
    <Stepper
      class="bg-white py-4 rounded-xl"
      v-model:activeStep="activeStepperStage"
      :model="stepperItems"
    />

    <div class="flex w-full justify-around lg:space-y-0 flex-col lg:flex-row">
      <section
        v-show="activeStepperStage === 0"
        class="extra-data space-y-4 lg:block flex flex-col items-center bg-white px-10 py-10 rounded-xl"
      >
        <div class="flex flex-col w-full relative">
          <label class="opacity-50 text-black" for="calendar">*Время отправки (по МСК)</label>
          <Calendar
            class="h-10"
            id="calendar"
            v-model="postData.uploadAt"
            showTime
            hourFormat="24"
            dateFormat="dd/mm/yy"
          />
        </div>
        <div class="flex flex-col w-full">
          <label class="opacity-50 text-black" for="tags-select">Теги</label
          ><MultiSelect
            v-model="postData.tags"
            id="tags-select"
            :options="prefefinedTags"
            filter
            placeholder="Выберите тег(и)"
          />
        </div>

        <div class="flex flex-col w-full">
          <label for="post-name" class="opacity-50 mb-2">*Название</label>
          <DynamicInput class="h-10" id="post-name" v-model="postData.name"></DynamicInput>
        </div>

        <footer class="w-full pt-3">
          <Button
            :disabled="!(postData?.name?.length && postData?.uploadAt)"
            class="main-button w-full flex items-center justify-center"
            @click="activeStepperStage++"
            >Дальше <i class="ml-3 pi pi-arrow-right"></i
          ></Button>
        </footer>
      </section>

      <section
        v-show="activeStepperStage === 1"
        class="post-data flex flex-col items-center space-y-4 bg-white p-6 rounded-xl border"
      >
        <div class="flex flex-col w-full">
          <Dropdown
            v-model="postData.organizationId"
            @change="orgSelected"
            id="ownerOrganisation-select"
            :options="organizationsData"
            optionLabel="name"
            optionValue="id"
            placeholder="Выберите организацию"
            checkmark
          />
        </div>
        <div class="flex flex-col w-full" v-show="integrationsData">
          <MultiSelect
            v-model="postData.integrationIds"
            id="integrations-select"
            :options="integrationsData"
            filter
            optionLabel="group_name"
            optionValue="id"
            placeholder="Выберите интеграцию(и)"
            :maxSelectedLabels="3"
          />
        </div>

        <footer class="w-full pt-3 flex">
          <Button
            class="main-button w-full flex items-center justify-center mr-2"
            @click="activeStepperStage--"
            ><i class="mr-3 pi pi-arrow-left"></i> Назад</Button
          >

          <Button
            :disabled="postData.integrationIds?.length === 0"
            class="main-button w-full flex items-center justify-center"
            @click="activeStepperStage++"
            >Дальше <i class="ml-3 pi pi-arrow-right"></i
          ></Button>
        </footer>

        <Dialog modal header="Предпросмотр" v-model:visible="showPreviewDialog">
          <div class="flex flex-col">
            <small class="mb-2" for="integrations-select"
              >Укажите интеграцию, в которую будет произведена тестовая публикация</small
            >
            <Dropdown
              v-model="previewIntegration"
              id="integrations-select"
              :options="integrationsData"
              filter
              optionLabel="group_name"
              optionValue="id"
              placeholder="Выберите интеграцию"
              :maxSelectedLabels="3"
            />
            <Button
              :disabled="previewIntegration === null"
              @click="createPreview"
              class="mt-4"
              label="Опубликовать"
            />
          </div>
        </Dialog>
      </section>

      <section
        v-show="activeStepperStage === 2"
        class="post-data flex flex-col items-center space-y-4 bg-white p-8 w-full max-w-xl rounded-xl border"
      >
        <div class="w-full relative">
          <emoji-menu
            @addSmile="(it) => (postData.body += it)"
            @closeMenu="showEmojiMenu = false"
            v-if="showEmojiMenu"
            class="absolute left-14 top-12"
          />
          <Editor
            id="text-editor"
            class="w-full"
            v-model="postData.body"
            editorStyle="height: 320px;"
            placeholder="Введите сообщение"
          >
            <template v-slot:toolbar>
              <span class="ql-formats">
                <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
                <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
                <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
                <button v-tooltip.bottom="'Link'" class="ql-link"></button>
                <button v-tooltip.bottom="'Strike'" class="ql-strike"></button>
                <button @click="showEmojiMenu = true"><i class="pi pi-face-smile"></i></button>
              </span>
            </template>
          </Editor>
        </div>
        <!-- <div class="flex justify-around w-full">
          <FileUpload @file-read="uploadAttachment" :type="'photo'" :id="'image-uploader'"
            ><button class="rounded-md main-button">
              <label class="hover:cursor-pointer" for="image-uploader">Фотографии</label>
            </button>
          </FileUpload>
          <FileUpload @file-read="uploadAttachment" :type="'document'" :id="'file-uploader'"
            ><button class="rounded-md main-button">
              <label class="hover:cursor-pointer" for="file-uploader">Файлы</label>
            </button>
          </FileUpload>
          <FileUpload @file-read="uploadAttachment" :type="'Видео'" :id="'file-uploader'"
            ><button class="rounded-md main-button">
              <label class="hover:cursor-pointer" for="file-uploader">Видео</label>
            </button>
          </FileUpload>
        </div> -->

        <file-upload-panel v-model="postData.attachments" :organization-id="postData.organizationId" />

        <footer class="w-full pt-3 flex">
          <Button
            class="main-button w-full flex items-center justify-center mr-4"
            @click="activeStepperStage--"
            ><i class="mr-4 pi pi-arrow-left"></i> Назад</Button
          >

          <Button
            :disabled="!postData?.integrationIds?.length"
            class="main-button w-full flex items-center justify-center"
            @click="createPost"
            >Опубликовать
          </Button>
        </footer>

        <Button
          :disabled="!  postData.body.length"
          @click="showPreviewDialog = true"
          class="text-blue-700"
          >Предпросмотр</Button
        >
      </section>
    </div>
    <Toast />
  </main>
</template>

<style>
.p-fileupload-content {
  padding: 0;
}
.p-editor-content {
  max-height: max(300px, 33vh);
}
</style>
