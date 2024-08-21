<script setup>
import LoginField from '../components/Auth/LoginField.vue';
import BlockScreen from '../components/UI/BlockScreen.vue';
import RegistrationField from '../components/Auth/RegistrationField.vue';
import { onMounted, ref, watch } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { SignIn, Register } from '../api/AuthApi';

const store = useStore();
const router = useRouter();

onMounted(() => {
  if (store.state.UserModule.User) {
    return router.push('/home');
  }

  watch(
    () => store.state.UserModule.User,
    () => {
      router.push('/home');
    }
  );
});

const defaultUserDate = () => ({
  username: '',
  fullName: '',
  password: ''
});

const userData = ref(defaultUserDate());

const isSignUp = ref(true);
const toast = useToast();

const changeMode = () => {
  isSignUp.value ^= true;
  userData.value = defaultUserDate();
};

const showBlockScreen = ref(false);

const login = async () => {
  showBlockScreen.value = true;

  const verdict = await SignIn(userData.value.username, userData.value.password);

  if (verdict.ok) {
    await store.dispatch('UserModule/initUserAfterLogin', verdict.data);
  } else {
    toast.add({
      severity: 'error',
      summary: verdict.error.type,
      detail: verdict.error.data,
      life: 3000
    });
  }

  showBlockScreen.value = false;
};

const register = async () => {
  showBlockScreen.value = true;

  const verdict = await Register(
    userData.value.username,
    userData.value.password,
    userData.value.fullName
  );

  if (verdict.ok) {
    toast.add({
      severity: 'success',
      summary: "sucess",
      detail: "account created",
      life: 3000,
    });
    changeMode();

  } else {
    toast.add({
      severity: 'error',
      summary: verdict.error.type,
      detail: verdict.error.data,
      life: 3000
    });
  }

  showBlockScreen.value = false;
};
function signIn() {}
</script>

<template>
  <main class="flex flex-col items-center justify-center relative">
    <div
      class="bg-white p-4 rounded-2xl sing-in fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"
    >
      <block-screen v-show="showBlockScreen" />
      <section>
        <div>
          <h2 class="text-center m-10"><span class="mbl">Prod</span>вижение</h2>
        </div>
      </section>

      <login-field @login="login" @change-mode="changeMode" v-model="userData" v-if="isSignUp" />
      <registration-field
        @register="register"
        @change-mode="changeMode"
        v-model="userData"
        v-else
      />
    </div>
  </main>
  <Toast />
</template>
