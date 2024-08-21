<script setup>
import InputText from 'primevue/inputtext';
import { computed } from 'vue';
import FloatLabel from 'primevue/floatlabel';
const model = defineModel();
const props = defineProps(['model', 'id', 'label', 'type']);
const inputType = computed(() => (props.type === 'password' ? 'password' : 'text'));
</script>

<template>
  <div class="flex justify-center w-full">
    <FloatLabel class="w-full">
      <label for="{{ props.id }}">{{ props.label }}</label>
      <InputText
        :type="inputType"
        class="border-2 border-primary-950 min-h-12 p-2 w-full"
        v-model="model"
        for="{{ props.id }}"
      />
    </FloatLabel>
  </div>
</template>
