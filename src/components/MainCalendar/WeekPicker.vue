<script setup>
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { monthNames } from '../../constants/TimeConstants';
import { getMonthWeeks } from '../../services/TimeService';
import { getTheDateAndMonthString } from '../../services/TimeService';
const WeekPicker = ref(null);

const props = defineProps({
  mainDate: { type: Date }
});

const date = ref(new Date(props.mainDate.getTime()));
const MonthWeeks = computed(() => getMonthWeeks(date.value));
const emit = defineEmits(['closeWeekPicker', 'gotoDate']);

onClickOutside(WeekPicker, () => {
  emit('closeWeekPicker');
});

const prevMonth = () => {
  if (date.value.getMonth() === 0) {
    return;
  }

  date.value = new Date(date.value.setMonth(date.value.getMonth() - 1));
};

const nextMonth = () => {
  if (date.value.getMonth() === 11) {
    return;
  }

  date.value = new Date(date.value.setMonth(date.value.getMonth() + 1));
};

const gotoDate = (date) => {
  emit('gotoDate', date);
  setTimeout(() => emit('closeWeekPicker'));
};
</script>

<template>
  <div ref="WeekPicker" class="w-96 z-10 rounded-xl p-4 shadow-2xl">
    <div class="flex items-center mb-4">
      <button @click="prevMonth">
        <i class="pi pi-angle-left" />
      </button>

      <div class="flex-1">
        <h5>{{ monthNames[date.getMonth()] }}</h5>
      </div>

      <button @click="nextMonth">
        <i class="pi pi-angle-right" />
      </button>
    </div>
    <div
      @click="gotoDate(week.startDate)"
      class="border p-2 rounded-xl m-2"
      v-for="week in MonthWeeks"
      :key="week.startDate"
    >
      {{ getTheDateAndMonthString(week.startDate) }} -
      {{ getTheDateAndMonthString(week.finishDate) }}
    </div>
  </div>
</template>
