<script setup>
import { ref, watch } from 'vue';
import Chart from 'primevue/chart';
import MainCalendar from '../components/MainCalendar/MainCalendar.vue';
import Dialog from 'primevue/dialog';
import * as stats from '../plugins/StatisticsPlugin';
import * as statsApi from '../api/StatisticsApi';
import * as postApi from '../api/PostApi';
import emitter from '@/plugins/EmitterPlugin';
import MultiSelect from 'primevue/multiselect';
import StatisticsBlock from '../components/UI/StatisticsBlock.vue';
import Calendar from 'primevue/calendar';
import DynamicInput from '../components/UI/DynamicInput.vue';
import Editor from 'primevue/editor';
import { prefefinedTags } from '../constants/CreateConstants';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const visible = ref(false);

const analyticsData = ref(null);
const postsOptions = ref(null);
const selectedPostsData = ref(null);

const engagmentRate = ref(0);
const viewPercentage = ref(0);
const viewAbsolute = ref(0);

const pieData = ref([]);

emitter.on('postSelected', async (id) => {
  visible.value = true;
  const data = (await statsApi.getData(id)).data;
  if (!data) return;
  analyticsData.value = data;
  const options = [];
  data.forEach((integration) => {
    options.push({ name: integration.integrationName, id: integration.integrationId });
  });
  postsOptions.value = options;
});

watch(selectedPostsData, (newValue) => {
  if (!newValue) return;
  const postsData = {
    positiveReactionCount: 0,
    neutralReactionCount: 0,
    negativeReactionCount: 0,
    membersCount: 0,
    viewCount: 0
  };
  analyticsData.value.forEach((integration) => {
    if (!newValue.includes(integration.integrationId)) return;
    const data = integration.statistics;

    postsData.positiveReactionCount += data.positiveReactionCount;
    postsData.negativeReactionCount += data.negativeReactionCount;
    postsData.neutralReactionCount += data.neutralReactionCount;
    postsData.membersCount += data.membersCount;
    postsData.viewCount += data.viewCount;
  });
  console.log(postsData);
  engagmentRate.value = Math.round(stats.calculateIngagmentRate(postsData) * 100);
  viewPercentage.value = Math.round((postsData.viewCount * 100) / postsData.membersCount);
  viewAbsolute.value = postsData.viewCount;
  pieData.value = stats.pieChartConfig(postsData);
});

const selectedPost = ref(null);
emitter.on('initEditPost', (post) => {
  selectedPost.value = { ...post };

  selectedPost.value.uploadAt = new Date(selectedPost.value.upload_date);
});

const changePost = async () => {
  const { uploadAt, name, tags, body } = selectedPost.value;


  const verdict = await postApi.editPost(selectedPost.value.id, { uploadAt, name, tags, body });

  if (verdict.ok) {
    location.reload();
  } else {
    toast.add({
      severity: 'error',
      summary: verdict.error.type,
      detail: verdict.error.data,
      life: 3000
    });
  }
};
</script>

<template>
  <div class="px-3 lg:px-10">
    <main-calendar />
  </div>
  <Dialog modal v-model:visible="visible" class="w-[90vw] h-[90vh] xl:w-[50vw] xl:h-[75vh]">
    <div class="flex flex-col items-center space-y-6">
      <div class="w-full md:w-3/4 flex flex-col items-center space-y-6">
        <MultiSelect
          v-model="selectedPostsData"
          :options="postsOptions"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите чаты для подсчета статистики"
          class="w-3/4"
        />
        <article>
          <StatisticsBlock label="Коэффициент вовлеченности:" :value="`${engagmentRate}%`" />
          <StatisticsBlock label="Пользователей посмотрело:" :value="viewAbsolute" />
          <StatisticsBlock label="Пользователей посмотрело:" :value="`${viewPercentage}%`" />
        </article>
      </div>
      <div v-if="pieData.length !== 0" class="flex flex-col items-center">
        <label for="reactions">Отношение реакций</label>
        <Chart id="reactions" type="pie" :data="pieData" :options="stats.pieChartOptions" />
      </div>
    </div>
  </Dialog>

  <Dialog header="Изменение поста" modal v-model:visible="selectedPost">
    <div class="flex flex-col w-full relative">
      <div class="flex flex-col w-full">
        <label for="post-name" class="opacity-50 mb-2">*Название</label>
        <DynamicInput class="h-10" id="post-name" v-model="selectedPost.name"></DynamicInput>
      </div>

      <label class="opacity-50 mt-6 text-black" for="calendar">*Время отправки (по МСК)</label>
      <Calendar
        class="h-10"
        id="calendar"
        v-model="selectedPost.uploadAt"
        showTime
        hourFormat="24"
        dateFormat="dd/mm/yy"
      />

      <div class="flex flex-col w-full mt-4">
        <label class="opacity-50 text-black" for="tags-select">Теги</label
        ><MultiSelect
          v-model="selectedPost.tags"
          id="tags-select"
          :options="prefefinedTags"
          filter
          placeholder="Выберите тег(и)"
        />
      </div>

      <Editor
        id="text-editor"
        class="w-full mt-4"
        v-model="selectedPost.body"
        editorStyle="height: 320px"
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

      <Button @click="changePost" label="Изменить" class="main-button mt-4"></Button>

      <small class="mt-4">Чтобы изменить список интеграций или медиа, пересоздайте пост</small>
    </div>
  </Dialog>
</template>
