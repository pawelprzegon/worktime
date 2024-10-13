<script setup>
import {useRouter} from "vue-router";

const router = useRouter()

const removeToken = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>

  <button
      class="logout-button"
      @click="removeToken"
  >Logout</button>

</template>

<style scoped>

</style>