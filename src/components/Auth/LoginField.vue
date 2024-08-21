<script setup>
import Button from 'primevue/button'
import Stepper from 'primevue/stepper'
import StepperPanel from 'primevue/stepperpanel'
import DynamicInput from '../UI/DynamicInput.vue'

const userData = defineModel()
const emit = defineEmits(['changeMode', 'login'])

const login = async () => {
  emit('login');
}

const changeMode = () => {
  emit('changeMode');
}
</script>

<template>
  <section class="w-80">
    <Stepper>
      <StepperPanel header="Логин">
        <template #content="{ nextCallback }">
          <div class="flex flex-column h-12rem mt-3">
            <DynamicInput v-model="userData.username" label="Логин"></DynamicInput>
          </div>
          <div class="flex pt-4 justify-center">
            <Button
              class="main-button w-full"
              label="Далее"
              icon="pi pi-arrow-right"
              iconPos="right"
              :disabled="userData.username === ''"
              @click="nextCallback"
            />
          </div>
        </template>
      </StepperPanel>

      <StepperPanel header="Пароль">
        <template #content="{ prevCallback }">
          <div class="flex flex-column h-12rem mt-3">
            <DynamicInput
            
              v-model="userData.password"
              label="Пароль"
              type="password"
            ></DynamicInput>
          </div>
          <div class="flex pt-4 justify-around">
            <Button
              class="main-button flex-1 mr-4"
              label="Назад"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="prevCallback"
            />
            <Button
              class="main-button flex-1"
              label="Войти"
              severity="secondary"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="login"
              :disabled="userData.password === ''"
            />
          </div>
        </template>
      </StepperPanel>
    </Stepper>

    <small class="flex justify-center mt-5"
      >Еще нет аккаунта?<button @click="changeMode" class="mbl translate-x-1">
        Регистрация
      </button></small
    >
  </section>
</template>