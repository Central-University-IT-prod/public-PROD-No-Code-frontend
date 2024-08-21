<script setup>
import { onMounted, watch, ref, computed } from 'vue';
import { monthNamesShort } from '../../constants/TimeConstants';
import { getDateWeekProperty, getTheDateAndMonthString } from '../../services/TimeService';
import { onClickOutside } from '@vueuse/core';
import Calendar from 'primevue/calendar';
import WeekPicker from './WeekPicker.vue';

const emit = defineEmits(['setDate']);
const model = defineModel();
const props = defineProps({
  mainDate: Date,
  hideElements: Boolean,
  hideBurger: Boolean
});

onMounted(() => {
  onMainDateChanged();
});

watch(
  () => props.mainDate,
  () => {
    onMainDateChanged();
  }
);
const weekProperties = ref(null);

const onMainDateChanged = () => {
  if (props.mainDate instanceof Date) {
    weekProperties.value = getDateWeekProperty(props.mainDate);
  }
};

const weekStartFinish = computed(() => {
  if (weekProperties.value === null) {
    return '';
  }

  const startString = getTheDateAndMonthString(weekProperties.value.startDate);
  const finishString = getTheDateAndMonthString(weekProperties.value.finishDate);

  return `${startString} - ${finishString}`;
});

const gotoMonth = (index) => {
  const __date = new Date(props.mainDate);
  __date.setMonth(index);
  emit('setDate', __date);
};

const ShowWeekPicker = ref(false);
const openWeekPicker = () => {
  ShowWeekPicker.value = true;
};
const closeWeekPicker = () => {
  ShowWeekPicker.value = false;
};

const gotoDate = (date) => {
  emit('setDate', date);
};

const showCalendarModel = ref(false);
const calendarModelValue = ref(null);
const caledarModel = ref(props.mainDate);
watch(
  () => calendarModelValue.value,
  (val) => {
    if (showCalendarModel.value) {
      gotoDate(val);
      setTimeout(() => closeCalendarModel(), 1);
    }
  }
);

const openCalendarModel = () => {
  calendarModelValue.value = props.mainDate;
  setTimeout(() => (showCalendarModel.value = true), 0);
};

const closeCalendarModel = () => {
  showCalendarModel.value = false;
};

onClickOutside(caledarModel, () => {
  closeCalendarModel();
});
</script>

<template>
  <div
    class="flex flex-col space-x-1 space-y-4 lg:space-x-0 md:space-y-0 justify-between md:flex-row 2xl:items-start pb-4 z-10"
  >
    <div
      class="min-w-48 2xl:min-w-96 bg-white flex items-center justify-around p-3 xl:p-4 rounded-2xl"
    >
      <button @click="openWeekPicker">
        <h4 class="font-normal">{{ weekStartFinish }}</h4>
        <week-picker
          :main-date="mainDate"
          v-if="ShowWeekPicker"
          @closeWeekPicker="closeWeekPicker"
          @gotoDate="gotoDate"
          class="absolute bg-white top-0 left-0"
        />
      </button>
      <div v-show="!hideBurger" @click.stop="model = true" class="md:hidden hover:cursor-pointer">
        <i class="pi pi-bars"></i>
      </div>
    </div>

    <div
      :class="{ hidden: hideElements }"
      class="rounded-xl grid py-2 bg-white grid-cols-3 sm:grid-cols-4 md:grid-cols-6 2xl:flex items-start"
    >
      <button
        class="px-3 py-1 xl:px-4 xl:py-2 mx-1 xl:mx-2 hover:shadow-xl rounded-xl duration-200"
        v-for="(month, index) in monthNamesShort"
        @click="gotoMonth(index)"
        :key="month"
        :class="{ 'text-text-500 shadow-xl': index === props?.mainDate?.getMonth() }"
      >
        <h4 class="font-normal">{{ month }}</h4>
      </button>
    </div>

    <button
      @click.stop="openCalendarModel"
      :class="{ hidden: hideElements }"
      class="bg-white p-4 rounded-2xl md:block relative"
    >
      <h4>{{ props?.mainDate?.getFullYear() }}</h4>
      <Calendar
        ref="caledarModel"
        v-show="showCalendarModel"
        v-model="calendarModelValue"
        class="absolute top-0 right-0 min-w-80 shadow-2xl"
        inline
      />
    </button>
  </div>
</template>
