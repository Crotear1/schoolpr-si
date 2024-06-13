<script setup>
import { useToast } from 'primevue/usetoast';
const session = useSupabaseSession()

const toast = useToast();

const dependencies = ref([])
const selectedDependencies = ref()

const isValid = computed(() => !selectedDependencies.value)

const visible = ref(false);
const date = ref(new Date())
const time = ref({
  time1: new Date(),
  time2: new Date()
})
const inputs = ref({
  location: '',
  problems: '',
  sources: '',
  activities: ''
})
const diaryString = ref('')

async function fetchWorkingPackages() {
  const response = await $fetch('/api/items/getWorkingPackages', {
    method: 'GET',
  });
  dependencies.value = response;
}

async function updateWorkingPackage(){
  const formattedDate = date.value.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const startTime = new Date(time.value.time1);
  const endTime = new Date(time.value.time2);
  const formattedStartTime = startTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const formattedEndTime = endTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const dependency = selectedDependencies.value;


  const response = await $fetch('/api/items/saveDiaryString', {
    method: 'POST',
    body: {
      email: session.value.user.email,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      date: formattedDate,
      durationHours: Math.abs(endTime - startTime) / 36e5,
      workPackage: dependency,
      description: diaryString.value,
      location: inputs.value.location,
      activities: inputs.value.activities,
      problems: inputs.value.problems,
      sources: inputs.value.sources
    }
  });
  toast.add({ severity: 'success', summary: 'Info', detail: 'Arbeitspaket erfolgreich aktualisiert', life: 3000 });

  visible.value = false;
}

watch(async () => visible.value, async () => {
  await fetchWorkingPackages();
  selectedDependencies.value = '';
});
</script>

<template>
  <div>
      <Button  type="button" size="large" icon="pi pi-calendar" rounded severity="success" @click="visible = true" v-tooltip.top="'Tagebuch'" />
      <Dialog v-model:visible="visible" modal header="Erstelle Tagebucheintrag" :style="{ width: '48rem', height: '29rem' }">
        <div style="display: flex;">
          <div>
            <VDatePicker v-model="date" color="green" />
          </div>
          <div style="margin-left: 20px;">
            <VDatePicker v-model="time.time1" mode="time" is24hr style="margin-left: 20px;" hide-time-header color="green"/>
            <VDatePicker v-model="time.time2" mode="time" is24hr style="margin-left: 20px;" hide-time-header color="green"/>
            <Dropdown class="giveMargin" style="width: 100%;" v-model="selectedDependencies" :options="dependencies" optionLabel="label" placeholder="Arbeitspakete" />
            <InputGroup class="giveMargin">
              <InputGroupAddon>
                <i class="pi pi-map-marker"></i>
              </InputGroupAddon>
              <InputText v-model="inputs.location" placeholder="Ort" />
            </InputGroup>
            <InputGroup class="giveMargin">
              <InputGroupAddon>
                <i class="pi pi-briefcase"></i>
              </InputGroupAddon>
              <InputText v-model="inputs.activities"  placeholder="Tätigkeiten" />
            </InputGroup>
            <InputGroup class="giveMargin">
              <InputGroupAddon>
                <i class="pi pi-thumbs-down-fill"></i>
              </InputGroupAddon>
              <InputText v-model="inputs.problems" placeholder="Probleme" />
            </InputGroup>
            <InputGroup class="giveMargin">
              <InputGroupAddon>
                <i class="pi pi-link"></i>
              </InputGroupAddon>
              <InputText v-model="inputs.sources" placeholder="Quellen" />
            </InputGroup>
          </div>
        </div>
          <div style="display: flex; justify-content: end; margin-top: 20px;">
              <Button :disabled="isValid" type="button" label="Speichern und erstellen" @click="updateWorkingPackage()"></Button>
          </div>
      </Dialog>
  </div>
  <Toast position="top-center"/>
</template>

<style>
.giveMargin {
  margin: 10px 0 0 25px;
}
</style>
