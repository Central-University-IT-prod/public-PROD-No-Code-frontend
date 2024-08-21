<script setup>
import Button from 'primevue/button'
import Stepper from 'primevue/stepper'
import StepperPanel from 'primevue/stepperpanel'
import DynamicInput from '../UI/DynamicInput.vue'
import {
  maxLoginLength,
  minLoginLength,
  minPasswordLength,
  maxPasswordLength
} from '../../constants/AuthConstants'

const userData = defineModel()
const emit = defineEmits(['changeMode', 'register'])

const changeMode = () => {
  emit('changeMode')
}

const signUp = () => {
  emit('register');
}
</script>

<template>
  <section class="w-90">
    <Stepper>
      <StepperPanel header="Логин">
        <template #content="{ nextCallback }">
          <div class="flex flex-col h-12rem items-end mt-3">
            <!-- <div class="list-disc ml-5 mb-3 mt-5 text-xs opacity-50 text-right">
              <div>От {{ minLoginLength }} до {{ maxLoginLength }} символов</div>
              <div>Латиница и цифры</div>
            </div> -->
            <DynamicInput v-model="userData.username" label="Логин"></DynamicInput>
          </div>
          <div class="flex pt-4 justify-center">
            <Button
              class="main-button w-full"
              label="Далее"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="nextCallback"
              :disabled="userData.username === ''"
            />
          </div>
        </template>
      </StepperPanel>

      <StepperPanel class="w-full" header="ФИО">
        <template #content="{ prevCallback, nextCallback }">
          <div class="flex flex-column h-12rem flex-col mt-3">
            <DynamicInput v-model="userData.fullName" label="ФИО"></DynamicInput>
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
              label="Далее"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="nextCallback"
              :disabled="userData.fullName === ''"
            />
          </div>
        </template>
      </StepperPanel>

      <StepperPanel header="Пароль">
        <template #content="{ prevCallback }">
          <div class="flex flex-col h-12rem items-end text-right mt-3">
            <!-- <div class="list-disc ml-5 mb-3 mt-5 text-xs opacity-50">
              <div>От {{ minPasswordLength }} до {{ maxPasswordLength }} символов</div>
              <div>Одна или более заглавная</div>
              <div>Одна или более цифра</div>
            </div> -->
            <DynamicInput v-model="userData.password" label="Пароль" type="password"></DynamicInput>
          </div>
          <div class="flex pt-4 justify-around">
            <Button
              class="main-button mr-4"
              label="Назад"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="prevCallback"
            />
            <Button
              class="main-button flex-1"
              label="Регистрация"
              severity="secondary"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="signUp"
              :disabled="userData.fullName === '' || userData.password === '' || userData.username === ''"
            />
          </div>
        </template>
      </StepperPanel>
    </Stepper>
    <small class="flex justify-center mt-5"
      >Уже зарегистрированы?<button @click="changeMode" class="mbl translate-x-1">
        Войти
      </button></small
    >
  </section>
</template>
