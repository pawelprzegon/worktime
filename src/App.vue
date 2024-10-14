<script setup>
  import { useRouter } from "vue-router";
  import { isAuthenticated, isAdmin, logout } from '@/auth.js';

  const router = useRouter()

  const gotoRegister = () => {
    router.push('/register')
  }

  const gotoLogin = () => {
    router.push('/login')
  }

  const gotoLogout = () => {
    logout()
    router.push('/')
  }

  const gotoDash = () => {
    router.push('/')
  }

  const gotoManagement = () => {
    router.push('/management')
  }


</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="90" height="90" />
    <button class="link" @click="gotoDash">Dashboard</button>
    <button class="link" v-if="!isAuthenticated" @click="gotoRegister">Register</button>
    <button class="link" v-if="!isAuthenticated" @click="gotoLogin">Login</button>
    <button class="link" v-if="isAuthenticated && isAdmin" @click="gotoManagement">Management</button>
    <button class="link" v-if="isAuthenticated" @click="gotoLogout">Logout</button>
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
