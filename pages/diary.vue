<script setup>
const diary = ref({})

async function loadDiary() {
  const response = await $fetch('/api/items/getDiary', {
    method: 'GET',
  })
  diary.value = response;


}

await loadDiary();


</script>

<template>

<Card class="card-height">
  <template #content>
    <div class="p-grid">
      <div class="p-col-12">
        <h1>Tagebuch</h1>
      </div>
      <div class="p-col-12">
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
    </div>
  </template>
</Card>

</template>
