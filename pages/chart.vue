<template>
  <div>
    <Card style="height: 100%;">
      <template #content>
        <GChart
          :type="type"
          :data="chartData"
          :options="options"
          :settings="settings"
        />
        <!-- <LoadingSpinner v-else /> -->
      </template>
    </Card>
  </div>
  <Toast position="top-center"/>
</template>

<script setup>
import { ref } from 'vue'
import { GChart } from 'vue-google-charts'

const toast = useToast()

const loading = ref(false)

const type = ref('Gantt')

/**
 * Parse a date string in the format 'YYYY-MM-DD' to a Date object
 * @param {string} dateString
 * @returns {Date}
 * @example
 * parseDateString('2024-05-01') // returns a Date object representing May 1, 2024
 */
function parseDateString(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

const chartData = reactive([]);

const options = ref({
  width:  '100%',
  height:  500,
  gantt: {
    palette: [
      '#10B981',   // Color for Task ID 'Research'
      '#3B82F6',   // Color for Task ID 'Write'
      '#F59E0B',   // Color for Task ID 'Cite'
      '#EF4444',   // Color for Task ID 'Complete'
      '#8B5CF6',   // Color for Task ID 'Outline'
      '#0EA5E9',   // Color for Task ID 'Outline1'
      '#D97706'    // Color for Task ID 'Outline2'
    ],

  },
});

/**
 * Fetch data from a data source
 * @returns {Promise<void>}
 */
async function fetchData() {
  const response = await $fetch('/api/ap/ganttData', {
    method: 'GET',
  })
  console.log(response.length);
  if(response.length < 2) {
    toast.add({ severity: 'error', summary: 'Keine Daten vorhanden', detail: 'Es sind keine Daten vorhanden.' });
    return;
  }

  const metadata = response[0];
  const processedData = response.slice(1).map(item => {
    const [task, description, start, end, ...rest] = item;
    return [task, description, parseDateString(start), parseDateString(end), ...rest];
  });

  chartData.length = 0;
  chartData.push(...[metadata, ...processedData]);
}

onBeforeMount(async () => {
  loading.value = true;
  await fetchData();
  loading.value = false;
})

const settings = ref({
  packages: ['gantt'],
})

</script>

