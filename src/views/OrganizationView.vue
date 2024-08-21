<script setup>
import { computed, reactive, ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import Toast from 'primevue/toast';
import RadioButton from 'primevue/radiobutton';
import FloatLabel from 'primevue/floatlabel';
import { useToast } from 'primevue/usetoast';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import * as meApi from '../api/MeApi';
import * as orgApi from '../api/OrganizationsApi';
import * as userApi from '../api/UserApi';
import { possibleRoles } from '../constants/OrganizationConstants';

const toast = useToast();
const store = useStore();

const visibleCreate = ref(false);
const visibleAddEmployee = ref(false);
const visibleAddIntegration = ref(false);
const partOfUsername = ref('');
const foundCandidates = ref(null);
const myOrgs = ref(null);
const myRole = ref('MEMBER');
const selectedOrg = ref(null);
const selectedOrgEmployees = ref(null);
const selectedOrgIntegrations = ref(null);
const user = ref(null);
const newOrgData = reactive({ name: '', description: '' });

const isInOrg = computed(() => myOrgs.length > 0);
const isOrgOwner = computed(
  () => selectedOrg.value && selectedOrg.value.owner_id === user.value.id
);
const allowOrgEditing = computed(() => ['OWNER', 'ADMIN'].includes(myRole.value));

const addPeople = computed(() => isInOrg && isOrgOwner);
const viewOrgEmployees = computed(() => addPeople || (isInOrg && !isOrgOwner));

async function createOrg() {
  const res = await orgApi.create(newOrgData.name, newOrgData.description);
  if (res.ok) {
    toast.add({
      severity: 'success',
      summary: 'Организация создана',
      detail: `${newOrgData.name} создана`,
      life: 3000
    });
    visibleCreate.value = false;
    await updateOrganizations();
    selectedOrg.value = myOrgs.value[myOrgs.value.length - 1];
    return;
  }
  toast.add({
    severity: 'error',
    summary: 'Ошибка при создании',
    detail: res.error.data,
    life: 3000
  });
}

watch(selectedOrgEmployees, (value) => {
  if (!value) return;
  value.forEach((employee) => {
    watch(employee, async (employeeValue) => {
      const newRole = employeeValue.role;
      const username = employeeValue.user.username;
      const res = await orgApi.changeMemberRole(selectedOrg.value.id, username, newRole);
      if (!res.ok) return;
      toast.add({
        severity: 'success',
        summary: 'Роль изменена',
        detail: `Роль ${username} изменена на ${newRole}`,
        life: 3000
      });
    });
  });
});

async function searchForCandidates() {
  const res = await userApi.search(partOfUsername.value);
  if (!res.data) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка при получении кандидатов',
      detail: 'Сервер не отвечает, попробуйте позже',
      life: 3000
    });
  }
  foundCandidates.value = res.data;
}

async function addEmployee(username) {
  const res = await orgApi.addMember(selectedOrg.value.id, username);
  if (!res.ok) return;
  toast.add({
    severity: 'success',
    summary: 'Пользователь добавлен',
    detail: `${username} был добавлен в ${selectedOrg.value.name}`,
    life: 3000
  });
  await updateEmployees(selectedOrg.value.id);
}

async function deleteMember(username) {
  const res = await orgApi.deleteMember(selectedOrg.value.id, username);
  if (!res.ok) return;
  toast.add({
    severity: 'success',
    summary: 'Пользователь удалён',
    detail: `${username} был удалён из ${selectedOrg.value.name}`,
    life: 3000
  });
  await updateEmployees(selectedOrg.value.id);
}

async function updateEmployees(orgId) {
  selectedOrgEmployees.value = [];
  const res = (await orgApi.getMembers(orgId)).data;
  selectedOrgEmployees.value = res;
  for (const employee of selectedOrgEmployees.value) {
    if (employee.user.id !== user.value.id) continue;
    myRole.value = employee.role;
    break;
  }
}

async function updateIntegrations(orgId) {
  selectedOrgIntegrations.value = [];

  const res = await orgApi.getIntegrations(orgId);

  if (!res.ok) {
    return;
  }

  res.data.forEach((integration) => {
    integration.type = integration.type.toLowerCase();
  });

  selectedOrgIntegrations.value = res.data;
}

async function updateOrganizations() {
  const res = await meApi.getOrganizations();
  if (!res.ok) return;
  myOrgs.value = res.data;
}

onMounted(async () => {
  watch(selectedOrg, async (newOrg) => {
    updateEmployees(newOrg.id);
    updateIntegrations(newOrg.id);
  });
  user.value = store.state.UserModule.User;
  await updateOrganizations();
  if (myOrgs.value.length) {
    selectedOrg.value = myOrgs.value[0];
  }
});
const integrationLink = ref(null);
const blockIntegrationCreate = ref(false);
const intergrationType = ref(null);

const openCreateIntegtation = () => {
  visibleAddIntegration.value = true;
};

async function initIntegrationCreate() {
  blockIntegrationCreate.value = true;
  integrationLink.value = null;

  const verdict = await orgApi.getAddIntegrationLink(selectedOrg.value.id, intergrationType.value);

  if (verdict.ok) {
    integrationLink.value = verdict.data;
    blockIntegrationCreate.value = false;
  }
}

function isEmployeeAdded(user) {
  return selectedOrgEmployees.value.findIndex((employee) => user.id === employee.user.id) !== -1;
}

watch(
  () => visibleAddIntegration.value,
  (val) => {
    if (!val) {
      integrationLink.value = null;
      blockIntegrationCreate.value = false;
      intergrationType.value = null;
    }
  }
);

watch(
  () => intergrationType.value,
  (val) => {
    if (val === null) {
      return;
    }

    initIntegrationCreate();
  }
);

const deleteOrganization = async () => {
  let verdict = confirm('Вы уверены?');

  if (verdict) {
    const res = await orgApi.deleteById(selectedOrg.value.id);

    if (res.ok) {
      location.reload();
    }
  }
};

const unlinkIntegration = () => {
  toast.add({
    severity: 'info',
    summary: 'Отвязка интеграции',
    detail: `Чтобы удалить интеграцию заберите права у бота в нужном канале`,
    life: 5000
  });
};
</script>

<template>
  <main class="px-10">
    <div class="justify-center items-center space-y-4 relative">
      <div v-show="!selectedOrg" class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div class="text-text-50 opacity-50">Выберите организацию</div>
      </div>

      <div class="flex-col inline-flex">
        <Button
          class="main-button w-full mb-3 h-10"
          @click="visibleCreate = true"
          label="Добавить организацию"
        />
        <Dropdown
          class="mb-4"
          v-model="selectedOrg"
          id="selected-org"
          :options="myOrgs"
          optionLabel="name"
          placeholder="Выберите организацию"
        />
      </div>

      <h2>{{ selectedOrg?.name }}</h2>
    </div>

    <div class="text-text-50 opacity-50" v-if="selectedOrg?.description?.length">
      {{ selectedOrg?.description }}
    </div>

    <section class="flex flex-wrap justify-between">
      <div class="max-w-full" v-if="selectedOrg && viewOrgEmployees">
        <h4 class="mb-4 mt-10">Сотрудники</h4>

        <div class="mb-2">
          <small class="opacity-50">
            Список сотрудников, которые могут публиковать посты от лицо организации
          </small>
        </div>

        <DataTable :value="selectedOrgEmployees">
          <Column field="user.full_name" header="ФИО"></Column>
          <Column field="user.username" header="Юзернейм"></Column>
          <Column field="role" header="Роль">
            <template #body="slotProps">
              <Dropdown
                v-if="slotProps.data.role !== 'OWNER' && allowOrgEditing"
                v-model="slotProps.data.role"
                :options="possibleRoles"
                option-group="role"
              >
                <template #optiongroup="slotProps">
                  <div>{{ slotProps.option.role }}</div>
                </template>
              </Dropdown>
              <div v-else>
                <div class="text-center">{{ slotProps.data.role }}</div>
              </div>
            </template>
          </Column>
          <Column field="action" header="Действие"
            ><template #body="slotProps">
              <Button
                v-if="
                  slotProps.data.user.id !== user.id &&
                  allowOrgEditing &&
                  slotProps.data.role !== 'OWNER'
                "
                @click="deleteMember(slotProps.data.user.username)"
                ><b>Исключить</b></Button
              >
            </template></Column
          >
        </DataTable>

        <Button
          v-if="allowOrgEditing"
          class="main-button w-full mt-4 h-12"
          @click="visibleAddEmployee = true"
          label="Добавить сотрудника"
        />
      </div>
      <div class="max-w-full" v-if="selectedOrg && viewOrgEmployees">
        <h4 class="mt-10 mb-4">Интеграции</h4>

        <div class="mb-2">
          <small class="opacity-50">
            Список интеграций (каналов, сообществ), привязанных к данной организации
          </small>
        </div>

        <DataTable :value="selectedOrgIntegrations">
          <Column class="flex items-center justify-center" field="action" header="Иконка">
            <template #body="slotProps">
              <img class="w-8" :src="`data:image/png;base64,${slotProps.data.group_avatar}`" />
            </template>
          </Column>
          <Column field="group_name" header="Название"></Column>
          <Column field="type" header="Тип"></Column>
          <Column field="action" header="Действие">
            <template #body>
              <Button v-if="allowOrgEditing" @click="unlinkIntegration"><b>Отвязать</b></Button>
            </template>
          </Column>
        </DataTable>

        <Button
          v-if="allowOrgEditing"
          class="main-button w-full mt-4 h-12"
          @click="openCreateIntegtation"
          label="Добавить интеграцию"
        />
      </div>
    </section>

    <div class="inline-flex flex-wrap flex-col mt-10" v-if="isOrgOwner">
      <h4 class="m-0 p-0 mb-4">Управление</h4>

      <div class="mb-2">
        <small class="opacity-50"> Удаление организации </small>
      </div>

      <Button
        v-if="isOrgOwner"
        class="bg-red-500 text-teal-50 w-full h-12"
        @click="deleteOrganization"
        label="Удалить"
      />
    </div>
  </main>

  <Dialog
    v-model:visible="visibleCreate"
    modal
    header="Новая организация"
    :style="{ width: '25rem' }"
  >
    <div class="flex flex-col align-items-center gap mb-3 mt-6">
      <FloatLabel class="w-full">
        <InputText
          @input="searchForCandidates"
          id="org-name"
          class="flex-auto p-2 w-full"
          autocomplete="off"
          v-model="newOrgData.name"
        />
        <label for="org-name">Название</label>
      </FloatLabel>
    </div>
    <div class="flex flex-col align-items-center gap-3 mb-5 mt-5">
      <label for="description" class="font-semibold">Описание</label>
      <textarea
        class="p-4 border rounded w-full h-20"
        v-model="newOrgData.description"
        id="description"
      ></textarea>
    </div>
    <div class="flex justify-around">
      <Button
        class="main-button flex-1 mr-4"
        type="button"
        label="Отмена"
        severity="secondary"
        @click="visibleCreate = false"
      ></Button>
      <Button class="main-button flex-1" type="button" label="Создать" @click="createOrg"></Button>
    </div>
  </Dialog>

  <Dialog
    v-model:visible="visibleAddIntegration"
    modal
    header="Добавление интеграции"
    :style="{ width: '25rem' }"
  >
    <div class="flex align-items-center mb-4 flex-col">
      <div v-show="intergrationType === null" class="w-full mb-2">
        <small class="opacity-50">Выберите тип интеграции:</small>
      </div>
      <div>
        <radio-button
          v-model="intergrationType"
          inputId="telegram"
          value="TELEGRAM"
          name="telegram"
        />
        <label for="telegram" class="ml-2">Telegram канал</label>
      </div>
    </div>

    <p v-show="intergrationType === 'TELEGRAM'">
      Для добавления <b>Telegram канала</b> необходимо перейти в наш бот по ссылке
      <a target="_blank" :href="integrationLink" class="text-blue-600">{{
        integrationLink ?? '...загрузка'
      }}</a>
      и действовать согласно его инструкциям.
    </p>
  </Dialog>

  <Dialog
    v-model:visible="visibleAddEmployee"
    modal
    header="Новый сотрудник"
    :style="{ width: '25rem' }"
  >
    <div class="w-full flex flex-col align-items-center gap-3 pt-5">
      <FloatLabel class="w-full">
        <InputText
          @input="searchForCandidates"
          id="username"
          class="flex-auto p-2 w-full"
          autocomplete="off"
          v-model="partOfUsername"
        />
        <label for="username">Логин</label>
      </FloatLabel>
    </div>

    <div v-if="foundCandidates" class="flex flex-col align-items-center gap-3 mb-5 mt-4">
      <label for="description" class="font-semibold">Найденные кандидаты</label>
      <div :key="candidate.username" v-for="candidate in foundCandidates">
        <div class="flex justify-between max-h-[40%] overflow-y-auto items-center p-2">
          <div>{{ candidate.username }}</div>
          <div>
            <p v-if="isEmployeeAdded(candidate)" class="space-x-1">
              <span>Добавлен</span><i class="pi pi-check"></i>
            </p>
            <Button
              class="bg-blue-200 px-2 py-1"
              v-else
              @click="(e) => addEmployee(candidate.username)"
              >Добавить</Button
            >
          </div>
        </div>
      </div>
    </div>
  </Dialog>
  <Toast />
</template>
