<script setup>
import { onMounted, watch, ref, inject } from 'vue';
import MainCalendarHeader from './MainCalendarHeader.vue';
import WeekDayPanel from './WeekDayPanel.vue';
import { getDateDayLocalNumber, getDateWeekProperty } from '../../services/TimeService';
import DayPostsList from './DayPostsList.vue';
import { getOrganizations } from '../../api/MeApi';
import { getByTimeRange } from '../../api/PostApi';
import { daysInWeek } from '../../constants/TimeConstants';

const mainDate = ref(new Date());
const showCalendar = ref(true);
const userOrganisationsList = ref(null);
const dateSelectPopupShow = ref(false);
const weekPosts = ref(new Array(daysInWeek));
const isMobileVersion = inject('isMobileVersion');

const getUserOrganisationsList = async () => {
  const res = await getOrganizations();

  userOrganisationsList.value = res.data;
};
watch(
  () => mainDate.value,
  async () => {
    await onMainDateChanged();
  }
);

const weekProperties = ref(null);

const onMainDateChanged = async () => {
  if (mainDate.value instanceof Date) {
    weekProperties.value = getDateWeekProperty(mainDate.value);
  }

  await getUserOrganisationsList();
  await getWeekPosts();
};

const setDate = (date) => {
  mainDate.value = date;
};

const getWeekPosts = async () => {
  const { startDate, finishDate } = weekProperties.value;

  for (let i = 0; i < daysInWeek; i++) {
    weekPosts.value[i] = [];
  }

  for (const organization of userOrganisationsList.value) {
    const res = await getByTimeRange(startDate.getTime(), finishDate.getTime(), organization.id);

    for (const post of res.data) {
      const date = new Date(post.upload_date);
      weekPosts.value[getDateDayLocalNumber(date) - 1].push(post);
      post.ownerOrganisation = organization;
    }
  }
};

onMounted(async () => {
  await onMainDateChanged();
});
</script>

<template>
  <article class="relative">
    <main-calendar-header
      v-model="dateSelectPopupShow"
      @setDate="setDate"
      class="sticky md:flex top-[4.2rem] 2xl:top-[8.4rem] bg-background-1000"
      :main-date="mainDate"
      :hideElements="isMobileVersion"
    />

    <div
      v-if="dateSelectPopupShow"
      class="overflow-y-scroll bg-background-1000 z-20 fixed top-0 left-0 w-screen min-h-[100vh] flex flex-col md:hidden"
    >
      <div class="relative top-[6rem]">
        <main-calendar-header
          @setDate="setDate"
          class="px-6 sticky 2xl:top-[8.4rem] bg-background-1000"
          :main-date="mainDate"
          hide-burger
        />
        <div class="w-full flex justify-center">
          <button @click="dateSelectPopupShow = false" class="main-button sm:mb-10 rounded-md">
            Закрыть
          </button>
        </div>
      </div>
    </div>

    <main
      v-if="userOrganisationsList && weekProperties"
      v-show="showCalendar"
      class="w-full mt-10 overflow-auto"
    >
      <div v-for="(day, index) in weekProperties?.daysList" :key="day" class="flex">
        <week-day-panel :picked="day.getDay() === mainDate?.getDay()" :day="day" />
        <day-posts-list
          :posts="weekPosts[index]"
          :userOrganisationsList="userOrganisationsList"
          :date="day"
        />
      </div>
    </main>
  </article>
</template>
