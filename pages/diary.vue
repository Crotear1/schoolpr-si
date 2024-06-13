<script setup>
const loading = ref(false)

const diary = ref({})

async function loadDiary() {
  loading.value = true
  const response = await $fetch('/api/items/getDiary', {
    method: 'GET',
  })
  diary.value = response;
  loading.value = false
}

await loadDiary();


</script>

<template>

<Card>
  <template #content>
    <div>
      <div>
        <h1>Tagebuch</h1>
      </div>
      <div v-if="!loading" >
        <DataTable :value="diary" :paginator="true" :rows="10" :rowsPerPageOptions="[5,10,20]">
          <Column field="email" header="Email"></Column>
          <Column field="date" header="Datum"></Column>
          <Column field="workPackage" header="Arbeitspaket"></Column>
          <Column field="startTime" header="Startzeit"></Column>
          <Column field="endTime" header="Endzeit"></Column>
          <Column field="durationHours" header="Dauer"></Column>
          <Column field="location" header="Ort"></Column>
          <Column field="activities" header="Aktivitäten"></Column>
          <Column field="problems" header="Probleme"></Column>
          <Column field="sources" header="Quellen"></Column>
        </DataTable>
      </div>
      <LoadingSpinner v-else />
    </div>
  </template>
</Card>

</template>
