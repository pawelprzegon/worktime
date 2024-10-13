<script setup>
  import { useRouter } from "vue-router";
  import {ref } from 'vue'
  import Logout from "@/components/Logout.vue";

  const token = ref(localStorage.getItem('token') !== null)
  const router = useRouter()

  const userPanel = () => {
    router.push('/user')
  }

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="90" height="90" />
    <p class="link" v-if="token" @click="userPanel"> My panel </p>
    <Logout />
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
