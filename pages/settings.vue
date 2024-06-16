<script setup>
import { useToast } from 'primevue/usetoast';
const session = useSupabaseSession();

const toast = useToast();

const loading = ref(true);

const loading2 = ref(false);

const loadingPersonRequest = ref(false);

const projectName = ref('');

const persons = ref([]);

const nodes = ref({})

const schoolWorkingDays = ref([]);

async function save() {
  loading2.value	= true;
  const response = await $fetch('/api/psp/pspsave', {
    method: 'POST',
    body: {
      token: session.value?.user,
      key: nodes.value.key,
      label: nodes.value.label,
      workingDays: nodes.value.workingDays,
      children: nodes.value.children,
      level: nodes.value.level,
    }
  })
  if(response === undefined) {
    toast.add({ severity: 'error', summary: 'Warning', detail: 'Etwas ist schiefgelaufen', life: 3000 });
  }
  toast.add({ severity: 'success', summary: 'Info', detail: 'Erfolgreich gespeichert', life: 3000 });
  loading2.value = false;
}

async function loadPSP() {
  const response = await $fetch('/api/psp/pspget', {
    method: 'GET',
  })
  if(response[0] === undefined) {
    toast.add({ severity: 'error', summary: 'Warning', detail: 'Etwas ist schiefgelaufen', life: 3000 });
    return;
  }

  nodes.value = response[0];
  projectName.value = response[0].label;
  loading.value = false;
}

async function getAllWorkdays() {
  const response = await $fetch('/api/items/getAllWorkdays', {
    method: 'GET',
  })
  response.forEach(element => {
    delete element.__v;
  });
  schoolWorkingDays.value = response;
}

await getAllWorkdays()

async function loadPersons(){
  const response = await $fetch('/api/ap/getApInformations', {
    method: 'GET',
  })

  persons.value = response.users;
}

async function renamedPerson() {
  loadingPersonRequest.value = true;
  const response = await $fetch('/api/items/renamePerson', {
    method: 'PUT',
    body: {
      token: session.value?.user,
      persons: persons.value
    }
  })
  if(response === undefined) {
    toast.add({ severity: 'error', summary: 'Warning', detail: 'Etwas ist schiefgelaufen', life: 3000 });
  }
  toast.add({ severity: 'success', summary: 'Info', detail: 'Erfolgreich gespeichert', life: 3000 });
  loadingPersonRequest.value = false;
}

onBeforeMount(async () => {
  await loadPSP()
  await loadPersons()
})

</script>
<template>
  <Card>
    <template #header>
      <h2 style="color: #4a4a4a; text-align: center; font-size: 2em; padding: 20px; border-bottom: 1px solid #ddd;">
        Einstellungen
      </h2>
    </template>
    <template #content>
      <div v-if="loading" style="height: 100%; display: flex; justify-content: center; align-items: center;">
        <ProgressSpinner />
      </div>
      <div v-else>
        <div style="height: calc(100vh - 240px); overflow-y: auto; overflow-y: auto;">
          <Fieldset legend="Projekt">
            <div style="display: flex; justify-content: center; ">
              <InputText v-tooltip.focus.top="'Gib deinen Projektnamen ein'" placeholder="Projektname" v-model="nodes.label" />
              <MultiSelect style="margin-left: 20px;" v-tooltip.focus.top="'Gib die Tage ein an denen du die Projektstunden hast'" v-model="nodes.workingDays" :options="schoolWorkingDays" optionLabel="name" placeholder="Schultage"
                :maxSelectedLabels="3" class="w-full md:w-20rem" />
            </div>
            <div style="display: flex; justify-content: end; margin-top: 20px;">
                <DeleteDialog style="margin-right: 10px;" />
                <Button :loading="loading2" label="Speichern" iconPos="right" @click="save()" />
            </div>
          </Fieldset>
          <div>
            <Fieldset legend="Personen">
              <div style="display: flex; flex-wrap: wrap; justify-content: center;">
                <div v-for="(person, index) in persons" :style="{ width: 'calc(30% - 10px)', marginBottom: '20px' }">
                    <div style="display: flex; justify-content: center; margin-left: 30px;">
                    <InputGroup style="width: 400px;">
                      <InputGroupAddon>
                        <i class="pi pi-user"></i>
                      </InputGroupAddon>
                      <InputText v-tooltip.focus.top="'Gib den Namen ein'" v-model="person.name" />

                    </InputGroup>
                  </div>
                </div>
              </div>
              <div style="display: flex; justify-content: end;">
                  <Button :loading="loadingPersonRequest" label="Speichern" iconPos="right" @click="renamedPerson()" />
              </div>
            </Fieldset>
          </div>
        </div>
      </div>
    </template>
  </Card>
  <Toast position="top-center" />
</template>

