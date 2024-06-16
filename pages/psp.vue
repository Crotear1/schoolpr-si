<script setup>
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import { useToast } from 'primevue/usetoast';

const session = useSupabaseSession()

const toast = useToast();

const nodes = ref({})

const loading = ref(false);

async function loadPSP() {
  const response = await $fetch('/api/psp/pspget', {
    method: 'GET',
  })
  if(response === 'PSP not found'){
    return;
  }
  nodes.value = response[0];
  if(response === undefined) {
    toast.add({ severity: 'warning', summary: 'Warning', detail: 'Etwas ist schiefgelaufen', life: 3000 });
  }
}

async function save() {
  // console.log(nodes.value)
  const response = await $fetch('/api/psp/pspsave', {
    method: 'POST',
    body: {
      token: session.value?.user,
      key: nodes.value.key,
      label: nodes.value.label,
      persons: nodes.value.persons,
      workingDays: nodes.value.workingDays,
      children: nodes.value.children,
      level: nodes.value.level,
    }
  })
  // console.log(response);
  if(response === undefined) {
    toast.add({ severity: 'warning', summary: 'Warning', detail: 'Etwas ist schiefgelaufen', life: 3000 });
  }
  toast.add({ severity: 'success', summary: 'Info', detail: 'Erfolgreich gespeichert', life: 3000 });
}

let output = ref('');
let hello = ref(null);
const setScreenshot = ref(true);


/**
 * Lädt den Screenshot herunter
 * @returns {void}
 */
const downloadScreenshot = async () => {
  setScreenshot.value = false;
  await nextTick();
  const canvas = await html2canvas(hello.value);
  output.value = canvas.toDataURL();
  setScreenshot.value = true;
  const link = document.createElement('a');
  link.href = output.value;
  link.download = 'screenshot.png';
  link.click();
};

function addOnePrimaryText(level, key){
    const newItem = {label: '1.1', level: 1, children: [], key: uuidv4()};

    function insertIntoId(node, key, newItem) {
      let counter = 1;
      if (node.key === key) {
        if(node.level === 1 || node.level === 2) {
          if(node.level === 1) {
            const parts = node.label.split(" ", 1)[0].split(".");
            let extraLabel = node.label.includes(" ") ? node.label.split(" ", 2)[1] : "";
            parts[2] = (parseInt(parts[2]) || 0) + 1;
            const newVersionString = parts.join(".") + (extraLabel ? " "  : "");
            const newItem3 = {label: newVersionString, level: 2, children: [], key: uuidv4()};
            node.children.push(newItem3);
          } else {
            const parts = node.label.split(".");
            parts[2] = parseInt(parts[2]) + 1;
            const newVersionString = parts.join(".");
            const newItem3 = {label: newVersionString, level: 2, children: [], key: uuidv4()};
            node.children.push(newItem3);
          }

          counter++;
        } else {
          node.children.push(newItem);
        }
        return;
      } else if (node.children && node.children.length > 0) {
        node.children.forEach(child => insertIntoId(child, key, newItem));
      }
    }

  if(level === 1 || level === 2) {
    nodes.value.children.forEach(child => insertIntoId(child, key, newItem));
  } else {
    nodes.value.children.push(newItem);

    let counter = 1;

    function updateLabels(node) {
      if (node.level === 1) {
        console.log(node)
        node.label = `1.${counter} ${node.label.split(" ", 2)[1] ? node.label.split(" ", 2)[1] : ""}`;
        counter++;
      }

      if (node.children) {
        node.children.forEach(updateLabels);
      }
    }
    updateLabels(nodes.value);
  }
}

function removeById(key){
  function remove(node, key) {
    let found = false;
    for (let i = 0; i < node.children.length; i++) {
      if (node.children[i].key === key) {
        const childrenToMove = node.children[i].children;
        node.children.splice(i, 1);
        i--;
        node.children.push(...childrenToMove);
        found = true;
      } else if (node.children[i].children && node.children[i].children.length > 0) {
        if (remove(node.children[i], key)) {
          found = true;
          i--;
        }
      }
    }
    return found;
  }

  remove(nodes.value, key);
}

onBeforeMount(async () => {
  loading.value = true;
  await loadPSP()
  loading.value = false;
})
</script>

<template>
  <div>
    <div style="height: calc(100vh - 90px); overflow-y: auto; overflow-y: auto;">
      <div style="margin-top: 15px;" ref='hello'>
        <OrganizationChart scale="0.7" :value="nodes">
            <template #default="slotProps">
                <InputGroup v-if="setScreenshot" style="display: flex; align-items: center;">
                  <Button v-if="slotProps.node.level === 0 || slotProps.node.children && slotProps.node.level === 2 && slotProps.node.children < 1 || slotProps.node.children && slotProps.node.level === 1 && slotProps.node.children < 1" icon="pi pi-plus" text rounded @click="addOnePrimaryText(slotProps.node.level, slotProps.node.key)"/>
                  <InputText v-model="slotProps.node.label"  />
                  <Button v-if="slotProps.node.level !== 0" icon="pi pi-trash" text rounded severity="danger" @click="removeById(slotProps.node.key)"/>
                </InputGroup>
                <div v-else>
                  <span>
                    {{ slotProps.node.label }}
                  </span>
                </div>

            </template>
        </OrganizationChart>
        </div>
    </div>
  </div>
  <Toast position="top-center"/>
  <Toolbar style="margin-top: auto;">
    <template #start>
      <Button icon="pi pi-download" @click="downloadScreenshot" style="margin-left: 5px;" />
    </template>
    <template #end>
      <div style="display: flex; justify-content: end;">
          <Button label="Speichern" iconPos="right" @click="save()" />
      </div>
    </template>
    </Toolbar>
</template>
