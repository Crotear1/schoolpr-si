<script setup lang="ts">
const session = useSupabaseSession();

const router = useRouter();

const nodes = ref([])

function navigateTo(route: string) {
    router.push('workingPackage/' + route);
}

function parseLabels(data) {
  function processNode(node) {
    // Label direkt in 'name' kopieren
    node.data = { name: node.label };

    // Rekursiv die Kindknoten bearbeiten, falls vorhanden
    if (node.children && node.children.length > 0) {
      node.children.forEach(processNode);
    }

    // Unnötiges 'label'-Feld entfernen
    delete node.label;
  }

  // Starte die Verarbeitung mit der gesamten Datenstruktur
  data.forEach(processNode);

  return data;
}

function flattenChildren(data) {
  for (const item of data) {
    const children = item.children;
    if (children.length > 0) {
      item.children = children.reduce((acc, child) => {
        // Vorhandene Children auf Level 1 in acc hinzufügen
        acc.push(child);  // Hier wird nur das child-Objekt selbst hinzugefügt
        // Level-2-Children zu acc hinzufügen
        acc.push(...child.children);
        // Rekursiv für Level-2-Children aufrufen
        flattenChildren(child.children);
        return acc;
      }, []); // Hier wird ein leeres Array als initialer Wert für acc verwendet
    }
  }
}

async function loadWorkPackages() {
  const response = await $fetch('/api/ap/apgetall', {
    method: 'GET',
  })

  const test = parseLabels(response)

  const test2 = flattenChildren(test);

  test.forEach((item) => {
    item.children.forEach((child) => {
      delete child.children
    })
  })

  nodes.value = test

//   console.log(nodes.value)
}

await loadWorkPackages()

// async function test() {
//   const response = await $fetch('/api/auth/checkAuth', {
//     method: 'POST',
//     body: {
//         token: session.value?.user
//     }
//   })
//   console.log(response)
// }

// await test();

// onBeforeMount(async () => {
//   await loadWorkPackages()
// })
</script>
<template>
    <Card>
        <template #title>
          <div style="display: flex; justify-content: space-between;">
            <div>
              <i class="pi pi-briefcase" style="margin-right: 2px;"></i>  Arbeitspakete
            </div>
            <div>
              <OverlayDiary></OverlayDiary>
            </div>
          </div>
        </template>
        <template #content>
            <TreeTable :value="nodes">
                <Column field="name" header="Name" expander></Column>
                <Column headerStyle="width: 10rem">
                    <template #body="{ node }">
                        <div v-if="!node.children" class="d-flex">
                            <SidebarVue :sidebar-id="String(node.key)" ></SidebarVue>
                            <Button text type="button" icon="pi pi-pencil" rounded severity="success" @click="navigateTo(node.key)" v-tooltip.top="'Bearbeiten'" />
                        </div>
                    </template>
                </Column>
            </TreeTable>
        </template>
    </Card>
</template>

<style>
.d-flex {
    display: flex;
    align-items: center;
}
</style>
