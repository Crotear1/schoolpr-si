<script setup>
const error = useError()

const gifUrl = 'https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif'

</script>

<template>
  <NuxtLayout>
    <div class="p-d-flex p-jc-center p-ai-center" style="height: 100vh; width: 100vw;">
      <Card>
        <template #title>
            <h2>Error {{ error.statusCode }}</h2>
        </template>
        <template #content>
          <div class="p-text-center">
            <img :src="gifUrl" alt="Dribbble Gif" style="width: 100%; height: auto;">
            <p>{{ error.message }}</p>
          </div>
        </template>
      </Card>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.p-d-flex {
  display: flex;
}
.p-jc-center {
  justify-content: center;
}
.p-ai-center {
  align-items: center;
}
.p-text-center {
  text-align: center;
}
</style>
