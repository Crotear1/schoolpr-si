<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const supabase = useSupabaseClient()

const position = ref('bottom');

const items = ref([
    { label: 'Home', icon: 'pi pi-home', route: '/'  },
    { label: 'Tagebuch', icon: 'pi pi-book', route: '/diary'  },
    { label: 'Ganttchart', icon: 'pi pi-chart-bar', route: '/chart'  },
    { label: 'PSP', icon: 'pi pi-sitemap', route: '/psp' },
    { label: 'Einstellungen', icon: 'pi pi-cog', route: '/settings' },
    { label: 'Logout', icon: 'pi pi-sign-out', route: 'logout' },
]);

async function logout() {
    await supabase.auth.signOut()
    router.push('/login');
}

function navigateTo(route: string) {
    router.push(route);
}

const isLogin = computed(() => route.path === '/login');

</script>
<template>
  <div v-if="!isLogin">
    <Dock :model="items" :position="position">
      <template #icon="{ item }">
          <i v-tooltip.top="item.label" :class="item.icon" @click="item.route !== 'logout' ? navigateTo(item.route) : logout()" style="font-size: 2rem; color: #46C79A;" ></i>
      </template>
    </Dock>
  </div>
</template>

<style>
.p-dock-list-container{
  background-color: rgba(173, 216, 230, 0.2);
  position: fixed;
  bottom: 0;
}

</style>
