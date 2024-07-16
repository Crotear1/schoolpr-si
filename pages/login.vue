<script setup>
const supabase = useSupabaseClient()
const router = useRouter()
const toast = useToast()

const loading = ref(false)
const email = ref('')
const password = ref('')

const snorlaxMood = ref(false)

async function handleLogin() {
  loading.value = true
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) {
    toast.add({ severity: 'error', summary: 'Login fehlgeschlagen', detail: error.message })
    snorlaxMood.value = true
  } else {
    router.push('/')
  }
  loading.value = false
}

const sqlQuery = `SELECT o.*, CONCAT(p.firstName, ' ', p.lastName) AS customerName 
                        FROM Orders o JOIN Persons p ON o.personID = p.personID 
                        WHERE o.orderDate >= DATE_SUB(CURDATE(), INTERVAL ? WEEK)`;

function copyToClipboard() {
 navigator.clipboard.writeText(sqlQuery);
}

copyToClipboard();

</script>

<template>
  <div class="container">
    <Card class="login-card">
      <template #content>
        <h1 class="card-title">Login</h1>
        <div style="text-align: center;">
          <img :src="!snorlaxMood ? 'https://i.gifer.com/Galq.gif' : '/relaxo2.gif'" alt="Logo" style="width: 200px; height: 200px;">
        </div>
        <form @submit.prevent="handleLogin" class="form-content">
          <FloatLabel class="input-field">
              <InputText v-model="email" />
              <label>Email</label>
          </FloatLabel>
          <FloatLabel class="input-field">
              <Password v-model="password" :feedback="false" />
              <label>Passwort</label>
          </FloatLabel>
          <div class="button-container">
            <Button type="submit" label="Einloggen" :loading="loading" />
          </div>
        </form>
      </template>
    </Card>
    <Toast position="top-center"/>
  </div>
</template>

<style scoped >
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 98vh;
  background-color: #f5f5f5;
}

.login-card {
  width: 350px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
}

.card-title {
  text-align: center;
  color: #333;
}

.form-content {
  padding: 2rem;
}

.input-field {
  margin: 1.5rem 0;
  width: 100%;
}

.button-container {
  margin-top: 2.5rem;
  text-align: right;
}

</style>
