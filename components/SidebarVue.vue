<script setup>
import html2canvas from 'html2canvas';

const props = defineProps({
  sidebarId: {
    type: String,
    required: true
  }
});

const visible = ref(false);

const workPackage = ref({});

let output = ref('');
let hello = ref(null);
const setScreenshot = ref(true);

/**
 * Führt einen Screenshot im nächsten Tick aus
 * @returns {Promise<void>}
 */
 const takeScreenshot = async () => {
  setScreenshot.value = false;
  await nextTick();
  const canvas = await html2canvas(hello.value);
  output.value = canvas.toDataURL();
  setScreenshot.value = true;
};

/**
 * Lädt den Screenshot herunter
 * @returns {void}
 */
const downloadScreenshot = () => {
  const link = document.createElement('a');
  link.href = output.value;
  link.download = 'screenshot.png';
  link.click();
};

async function getAP() {
  const response = await $fetch(`/api/ap/getAP/${props.sidebarId}`, {
    method: 'GET',
  });
  workPackage.value = response;
}

await getAP();

</script>

<template>
  <div class="card flex justify-content-center">
      <Sidebar v-model:visible="visible" header="Arbeitspaket" position="full" >
        <div ref="hello" class="work-package-specification">
          <Card class="specification-card">
            <template #header>
              <div class="header-content">
                <h2 class="title">{{ workPackage.label }}</h2>
              </div>
            </template>
            <template #content>
              <div class="content-section">
                <h3>AP-Inhalt (Was soll getan werden?)</h3>
                <ul>
                  <li >{{ workPackage.workPackageContent }}</li>
                </ul>
              </div>
              <div class="content-section">
                <h3>AP-Nicht-Inhalte (Was soll nicht getan werden?)</h3>
                <ul>
                  <li>{{ workPackage.workPackageNotContent }}</li>
                </ul>
              </div>
              <div class="content-section">
                <h3>AP-Ergebnisse (Was liegt nach Beendigung des Arbeitspaketes vor?)</h3>
                <ul>
                  <li>{{ workPackage.workPackageResult }}</li>
                </ul>
              </div>
              <div class="content-section">
                <h3>AP-Leistungsfortschrittsmessung (Wie wird der Fortschritt gemessen?)</h3>
                <ul>
                  <li>{{ workPackage.workPackagePerformance }}</li>
                </ul>
              </div>
            </template>
          </Card>
        </div>
        <div style="margin-top: 10px;">
          <Button icon="pi pi-download" @click="downloadScreenshot" style="margin-left: 5px;" />
        </div>
      </Sidebar>
      <Button text type="button" icon="pi pi-search" v-tooltip.top="'Anzeigen'" rounded severity="success" @click="visible = true" />
  </div>
</template>

<style scoped>
.work-package-specification {
  /* Container styles */
}

.specification-card {
  /* Card styles */
}

.header-content {
  display: flex;
  align-items: baseline;
}

.psp-code {
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 1rem;
}

.title {
  font-size: 1.5rem;
  margin: 0;
}

.content-section {
  margin-bottom: 1.5rem;
}

h3 {
  margin-top: 0;
}
</style>

