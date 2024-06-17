<script setup>
import { useToast } from 'primevue/usetoast';
const session = useSupabaseSession()

const router = useRouter();

const toast = useToast();

const visible = ref(false);

async function deletePSP(){
    const response = await $fetch('/api/psp/pspdelete', {
        method: 'DELETE',
        body: {
            token: session.value?.user,
        }
    })
    toast.add({ severity: 'success', summary: 'Success', detail: 'Projekt wurde erfolgreich gelöscht', life: 3000 });
    router.push('/start')
}


</script>

<template>
  <div class="card flex justify-content-center">
      <Button label="Projekt löschen" severity="danger" @click="visible = true" />
      <Dialog v-model:visible="visible" modal header="Projekt löschen" :style="{ width: '25rem' }">
          <span class="p-text-secondary block mb-5">Möchtest du das Projekt wirklich löschen?</span>
          <div style="display: flex; justify-content: end; margin-top: 20px;">
              <Button type="button" label="Abbrechen" severity="secondary" @click="visible = false" style="margin-right: 10px;"></Button>
              <Button type="button" label="Löschen" severity="danger" @click="deletePSP(), visible = false"></Button>
          </div>
      </Dialog>
  </div>
</template>
