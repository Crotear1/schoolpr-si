<script setup lang="ts">
const session = useSupabaseSession();

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
  for (const item of data) {
    const children = item.children;
    if (children.length > 0) {
      item.children = children.reduce((acc, child) => {
        acc.push(child);
        acc.push(...child.children);
        flattenChildren(child.children);
        return acc;
      }, []);
    }
  }
}

async function loadWorkPackages() {
  loading.value = true
  const response = await $fetch('/api/ap/apgetall', {
    method: 'GET',
  })

  const parsedLabels = parseLabels(response)

  flattenChildren(parsedLabels);

  parsedLabels.forEach((item) => {
    item.children.forEach((child) => {
      delete child.children
    })
  })

  nodes.value = parsedLabels

  loading.value = false
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
        <template v-if="!loading" #content>
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
        <template v-else #content>
            <LoadingSpinner />
        </template>
    </Card>
</template>

<style>
.d-flex {
    display: flex;
    align-items: center;
}
</style>
