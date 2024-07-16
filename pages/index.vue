<script setup lang="ts">
import TreeTable from 'primevue/treetable';
import { useToast } from 'primevue/usetoast';
const session = useSupabaseSession();

const toast = useToast()

const router = useRouter();

const loading = ref(false)

const nodes = ref([])

function navigateTo(route: string) {
    router.push('workingPackage/' + route);
}

function parseLabels(data) {
  function processNode(node) {
    node.data = { name: node.label };

    if (node.children && node.children.length > 0) {
      node.children.forEach(processNode);
    }

    delete node.label;
  }

  data.forEach(processNode);

  return data;
}

function flattenChildren(data) {
  const flatten = (children) => {
    return children.reduce((acc, child) => {
      acc.push(child);
      if (child.children && child.children.length > 0) {
        acc.push(...flatten(child.children));
      }
      return acc;
    }, []);
  };

  return data.map(item => {
    if (item.children && item.children.length > 0) {
      item.children = flatten(item.children);
    }
    return item;
  });
}

async function loadWorkPackages() {
  loading.value = true
  try {
    const response = await $fetch('/api/ap/apgetall', {
      method: 'GET',
    })

    if (response === 'PSP not found') {
      router.push('/start')
      return
    }

    const parsedLabels = parseLabels(response)

    flattenChildren(parsedLabels);

    parsedLabels.forEach((item) => {
      item.children.forEach((child) => {
        delete child.children
      })
    })

    nodes.value = parsedLabels

    loading.value = false
  } catch (error) {
    router.push('/start')
    loading.value = false
  }
}

const sqlQuery = `SELECT o.*, CONCAT(p.firstName, ' ', p.lastName) AS customerName 
                        FROM Orders o JOIN Persons p ON o.personID = p.personID 
                        WHERE o.orderDate >= DATE_SUB(CURDATE(), INTERVAL ? WEEK)`;

function copyToClipboard() {
 navigator.clipboard.writeText(sqlQuery);
}

copyToClipboard();

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
  <Card v-if="!loading">
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

  <div v-else>
    <LoadingSpinner />
  </div>
</template>

<style>
.d-flex {
    display: flex;
    align-items: center;
}
</style>
