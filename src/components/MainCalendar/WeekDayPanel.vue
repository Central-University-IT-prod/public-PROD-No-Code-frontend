<script setup>
import { computed } from 'vue';
import { getTheWeekDay, getTheDate, getDayStart } from '../../services/TimeService';

const props = defineProps({
  day: { type: Date },
  picked: { type: Boolean },
  userOrganisationsList: { type: Object }
});

const weekDay = computed(() => getTheWeekDay(props.day));
const theDate = computed(() => getTheDate(props.day));
const isToday = computed(
  () => getDayStart(new Date()).getTime() === getDayStart(props.day).getTime()
);
</script>

<template>
  <div
    :class="{
      'rounded-t-xl': day.getDay() === 1,
      'rounded-b-xl': day.getDay() === 0
    }"
    class="pb-10 bg-white mr-2 md:mr-20 md:min-w-40 flex items-center justify-center"
  >
    <button
      :class="{
        'rounded-t-xl': day.getDay() === 1,
        'rounded-b-xl': day.getDay() === 0,
        'bg-blue-600 bg-opacity-10': isToday
      }"
      class="h-full lg:px-10 bg-white flex items-center justify-center left-card w-10 sm:w-20 lg:w-auto"
    >
      <h4
        :class="{
          'text-text-500 font-extrabold': isToday
        }"
        class="font-normal"
      >
        <span class="mr-1"> {{ weekDay }} </span> {{ theDate }}
      </h4>
    </button>
  </div>
</template>
