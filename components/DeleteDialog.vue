<script setup>
const visible = ref(false);


</script>

<template>
  <div class="card flex justify-content-center">
      <Button label="Projekt löschen" severity="danger" @click="visible = true" />
      <Dialog v-model:visible="visible" modal header="Projekt löschen" :style="{ width: '25rem' }">
          <span class="p-text-secondary block mb-5">Möchtest du das Projekt wirklich löschen?</span>
          <div style="display: flex; justify-content: end; margin-top: 20px;">
              <Button type="button" label="Abbrechen" severity="secondary" @click="visible = false" style="margin-right: 10px;"></Button>
              <Button type="button" label="Löschen" severity="danger" @click="visible = false"></Button>
          </div>
      </Dialog>
  </div>
</template>
