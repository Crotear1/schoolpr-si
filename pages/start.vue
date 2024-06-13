<script setup>
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();

const loading = ref(false);

const isValid = computed(() => {
  return nodes.value.persons.length > 0 && nodes.value.workingDays.length > 0 && projectName.value !== '';
})

const projectName = ref('');

const nodes = ref({
  persons: [],
  workingDays: [],
  label: projectName.value,
  level: 0,
  key: uuidv4(),
  children: [

  ]
})

const schoolWorkingDays = ref([]);

function addPerson() {
  nodes.value.persons.push({
    name: '',
    id: uuidv4(),
    supabaseId: '',
    email: '',
  });
}

/**
 * Setzt den Projektnamen in das Label des Wurzelelements
 * @returns {void}
 */
function setProjectName() {
  nodes.value.label = projectName.value;
}

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

/**
 * Entfernt ein Element aus der children Liste des Elements mit der gesuchten ID
 * @param {string} key - ID des Elements
 * @returns {void}
 * @example
 * removeById('1.1.3')
 * // => {label: 'Argentina', level: 1, children: [], key: '1.1.3'}
 */
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


let output = ref('');
let hello = ref(null);
const setScreenshot = ref(true);

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

async function save() {
  loading.value = true;
  // const response = await $fetch('/api/auth/saveIdOnce', {
  //   method: 'POST',
  //   body: {
  //     persons: nodes.value.persons,
  //   }
  // })

  // nodes.value.persons.forEach((person) => {
  //   delete person.supabaseId;
  //   delete person.email;
  // })

  const response = await $fetch('/api/psp/pspsave', {
    method: 'POST',
    body: {
        key: nodes.value.key,
        label: nodes.value.label,
        persons: nodes.value.persons,
        workingDays: nodes.value.workingDays,
        children: nodes.value.children,
        level: nodes.value.level,
      }
    })

    const response2 = await $fetch('/api/auth/saveIdOnce', {
      method: 'POST',
      body: {
        persons: nodes.value.persons,
      }
    })

  toast.add({ severity: 'success', summary: 'Info', detail: 'Erfolgreich gespeichert', life: 3000 });
  router.push('/');
  loading.value = false;
}

async function getAllWorkdays() {
  const response = await $fetch('/api/items/getAllWorkdays', {
    method: 'GET',
  })
  schoolWorkingDays.value = response;
}

await getAllWorkdays()

// onBeforeMount(async () => {
//   const response = await $fetch('/api/psp/get', {
//     method: 'GET',
//   })
//   if(response[0] !== undefined) {
//     router.push('/')
//   }
// })

</script>


<template>
  <div class="card flex justify-content-center">
      <Stepper>
          <StepperPanel header="Projekauftrag">
              <template #content="{ nextCallback }">
                  <Message severity="info" style="margin-left: 10px; margin-right: 10px;">Alle Eingaben können später bis auf die Personen wieder geändert werden</Message>

                  <Fieldset legend="Projektauftrag" >
                    <div>
                      <div style="height: calc(100vh - 370px); overflow-y: auto; overflow-y: auto;">
                        <div style="display: flex; justify-content: center; ">

                              <InputText v-tooltip.focus.top="'Gib deinen Projektnamen ein'" placeholder="Projektname" v-model="projectName" />

                          <MultiSelect style="margin-left: 20px;" v-tooltip.focus.top="'Gib die Tage ein an denen du die Projektstunden hast'" v-model="nodes.workingDays" :options="schoolWorkingDays" optionLabel="name" placeholder="Schultage"
                            :maxSelectedLabels="3" class="w-full md:w-20rem" />
                        </div>
                    <div>
                      <Fieldset legend="Personen">
                        <div style="display: flex; justify-content: end; margin-top: 20px;">
                          <Button label="Person hinzufügen" class="w-full md:w-20rem" @click="addPerson()" />
                        </div>
                        <div style="display: flex; flex-wrap: wrap; justify-content: center; margin-top: 15px;">
                          <div v-for="(person, index) in nodes.persons" :style="{ width: 'calc(50% - 10px)', marginBottom: '20px' }">
                              <div style="display: flex; justify-content: center;">
                              <InputGroup style="width: 600px;">
                                <InputGroupAddon>
                                  <i class="pi pi-user"></i>
                                </InputGroupAddon>
                                <InputText v-tooltip.focus.top="'Gib den Namen ein, eh logisch oda?'" v-model="person.name" />
                                <InputText v-tooltip.focus.top="'Gib die ID ein, eh logisch oda?'" v-model="person.supabaseId" />
                                <InputText v-tooltip.focus.top="'Gib die Email ein, eh logisch oda?'" v-model="person.email" />

                              </InputGroup>
                              <Button icon="pi pi-trash" text rounded severity="danger" @click="nodes.persons.splice(index, 1)" />
                            </div>
                          </div>
                        </div>
                      </Fieldset>
                    </div>
                  </div>
                </div>
                <Toolbar style="margin-top: auto;">
                  <template #end>
                    <div>
                      <Button :disabled="!isValid" label="Weiter" icon="pi pi-arrow-right" iconPos="right" @click="nextCallback(); setProjectName();" />
                    </div>
                  </template>
                </Toolbar>
              </Fieldset>
            </template>
          </StepperPanel>
          <StepperPanel header="Projekstrukturplan" style="display: flex; flex-direction: column; justify-content: space-between; height: 100vh;">
              <template #content="{ prevCallback, nextCallback }">
                  <div >
                      <div style="height: calc(100vh - 220px); overflow-y: auto; overflow-y: auto;">
                        <div ref='hello'>
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
                  <Toolbar style="margin-top: auto;">
                    <template #start>
                      <Button icon="pi pi-download" @click="downloadScreenshot" style="margin-left: 5px;" />
                    </template>
                    <template #end>
                      <div style="display: flex; justify-content: end;">
                          <Button label="Zurück" severity="secondary" icon="pi pi-arrow-left" @click="prevCallback" />
                          <Button label="Speichern" icon="pi pi-arrow-right" iconPos="right" @click="save()" />
                      </div>
                  </template>
                  </Toolbar>
              </template>
          </StepperPanel>
      </Stepper>
      <Toast position="top-center"/>
  </div>
</template>

<style scoped>
.p-stepper {
  flex-basis: 50rem;
}
</style>
