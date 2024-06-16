<script setup lang="ts">
import { useToast } from 'primevue/usetoast';

const session = useSupabaseSession();

const toast = useToast();

const router = useRouter();

const route = useRoute();

const apName = ref('');

const loading = ref(true);
const isLoading = ref(false);

const date = ref(new Date())

const packageId = route.params.workPackageId;

// const selectedDependencies = ref<any>('');
// const dependencies = ref([
//     { name: 'New York', code: 'NY' },
//     { name: 'Rome', code: 'RM' },
//     { name: 'London', code: 'LDN' },
//     { name: 'Istanbul', code: 'IST' },
//     { name: 'Paris', code: 'PRS' }
// ]);

const schoolDays = ref([]);

const attributes = computed(() => [
  ...schoolDays.value.map(day => ({
    dates: day.dates,
    dot: {
      color: day.color,
      ...(day.isComplete && { class: 'opacity-75' }),
    },
    popover: {
      label: day.description,
    },

  })),
  // {
  //   highlight: {
  //     start: { fillMode: 'outline' },
  //     base: { fillMode: 'light' },
  //     end: { fillMode: 'outline' },
  //   },
  //   dates: { start: new Date(2024, 4, 14), end: new Date(2024, 4, 16) },
  // },
]);
const confirm = useConfirm();
const requireConfirmation = (event: any) => {
    confirm.require({
        target: event.currentTarget,
        group: 'headless',
        message: 'Save your current process?',

    });
}

const packageFields = ref({
  workPackageContent: '',
  workPackageNotContent: '',
  workPackageResult: '',
  workPackagePerformance: '',

});


const selectedPerson = ref();
const persons = ref([]);

const makeReadAbleDate = (dateString: Date) => {
  if(!dateString) return '';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
}

const convert = (dateString: Date) => {
  if(!dateString) return '';
  let date = new Date(dateString);
  let month = ('0' + (date.getMonth() + 1)).slice(-2); // Monate sind 0-basiert in JavaScript
  let day = ('0' + date.getDate()).slice(-2);
  return `${date.getFullYear()}-${month}-${day}`;
}

const mathDuration = (start: Date, end: Date) => {
  if(!start || !end) return '';
  const diff = end.getTime() - start.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return days;
}

async function saveWorkingPackage() {
  isLoading.value = true;

  const response = await $fetch(`/api/ap/putAP/${packageId}`, {
    method: 'PUT',
    body: {
      token: session.value?.user,
      startdate: convert(date.value.start),
      enddate: convert(date.value.end),
      workPackageContent: packageFields.value.workPackageContent,
      workPackageNotContent: packageFields.value.workPackageNotContent,
      workPackageResult: packageFields.value.workPackageResult,
      workPackagePerformance: packageFields.value.workPackagePerformance,
      selectedPersons: selectedPerson.value,
      dependency: null,
      duration: mathDuration(date.value.start, date.value.end),
    }
  })
  isLoading.value = false;
  toast.add({ severity: 'success', summary: 'Success', detail: 'Arbeitspaket wurde erfolgreich gespeichert', life: 3000 });
}

async function loadDependencies() {
  const response = await $fetch<any>('/api/ap/getApInformations', {
    method: 'GET',
  })

  persons.value = response.users;
  schoolDays.value = response[0].workingDays;

}
await loadDependencies();

async function fetchWorkPackage(){
  const response = await $fetch(`/api/ap/getAP/${packageId}`, {
    method: 'GET',
  })
  packageFields.value = {
    workPackageContent: response.workPackageContent,
    workPackageNotContent: response.workPackageNotContent,
    workPackageResult: response.workPackageResult,
    workPackagePerformance: response.workPackagePerformance,
  }

  apName.value = response.label;



  selectedPerson.value = response.selectedPersons[0];
  console.log(response)

  if(response.startdate && response.enddate !== null){
    date.value = {
      start: new Date(response.startdate),
      end: new Date(response.enddate),
    }
  }

}

onBeforeMount(async () => {
  await fetchWorkPackage()
  // await loadDependencies()

  loading.value = false;
})
</script>

<script setup>
</script>

<template>
  <Card class="card-height">
    <template #content>
      <div v-if="loading">
        <LoadingSpinner />
      </div>
      <div v-else>
        <Fieldset :legend="'Arbeitspaket: ' + apName">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
            <div>
              <div style="display: flex; align-items: center;">
                <SelectButton class="my-select-button" v-model="selectedPerson" :options="persons" optionLabel="name" aria-labelledby="basic" />
                <i class="pi pi-question-circle" v-tooltip.top="'Personen die am Arbeitspaket arbeiten'" style="color: var(--primary-color); margin-left: 10px;"></i>
              </div>
            </div>
            <div>
              <!-- <Dropdown  v-model="selectedDependencies" :options="dependencies" optionLabel="name" placeholder="Abhängigkeit" /> -->
            </div>
            <div>
              <ConfirmPopup group="headless">
                <template #container="{ message, acceptCallback, rejectCallback }">
                  <div>
                    <client-only>
                      <VDatePicker color="green" v-model.range="date" :attributes="attributes" />
                    </client-only>
                    <div class="button-spacing">
                      <Button label="Save" @click="acceptCallback" size="small"></Button>
                      <Button label="Cancel" outlined @click="rejectCallback" severity="secondary" size="small" text style="margin-left: 10px;"></Button>
                    </div>
                  </div>
                </template>
              </ConfirmPopup>
              <div>
                <Button @click="requireConfirmation($event)" :label="`Datum: ${makeReadAbleDate(date.start)} - ${makeReadAbleDate(date.end)}`"></Button>
              </div>
            </div>
          </div>
          <div class="formgrid grid">
            <div class="field col">
              <FloatLabel class="margin-top">
                <Textarea autoResize class="style-textarea" v-model="packageFields.workPackageContent" rows="5" cols="30" />
                <label>AP-Inhalt</label>
              </FloatLabel>
            </div>
            <div class="field col">
              <FloatLabel class="margin-top" >
                <Textarea class="style-textarea" autoResize v-model="packageFields.workPackageNotContent" rows="5" cols="30" />
                <label>	AP-Nicht-Inhalte </label>
              </FloatLabel>
            </div>
          </div>
          <div class="formgrid grid">
            <div class="field col">
              <FloatLabel class="margin-top">
                <Textarea class="style-textarea" autoResize v-model="packageFields.workPackagePerformance" rows="5" cols="30" />
                <label>	AP-Ergebnisse </label>
              </FloatLabel>
            </div>
            <div class="field col">
              <FloatLabel class="margin-top">
                <Textarea class="style-textarea" autoResize v-model="packageFields.workPackageResult" rows="5" cols="30" />
                <label>	AP-Leistungsfortschrittsmessung </label>
              </FloatLabel>
            </div>
          </div>
        </Fieldset>
        <div style="display: flex; justify-content: end; margin-top: 40px;">
          <Button label="Zurück" @click="router.push('/')" text style="margin-right: 5px;" />
          <Button :loading="isLoading" label="Speichern" @click="saveWorkingPackage()" />
        </div>
      </div>
    </template>
  </Card>
  <Toast position="top-center" />
</template>

<style>
.card-height {
  height: calc(100vh - 100px);
}
.margin-top {
  margin-top: 25px;
}

.style-textarea {
  width: 100%;
  margin-top: 4px;
  max-height: 130px;
}

.margin-top {
  margin-top: 25px;
}

.my-select-button .p-button {
  background-color: #10B981;
}

.my-select-button .p-button-label {
  color: black;
}

.button-spacing {
  margin: 10px;
}

</style>
