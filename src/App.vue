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
    <img alt="Vue logo" class="logo" src="./assets/img/beb.webp" width="90" height="70" />
    <div class="nav-buttons">
      <button class="link" @click="gotoDash">Dashboard</button>
      <button class="link" v-if="!isAuthenticated" @click="gotoRegister">Register</button>
      <button class="link" v-if="!isAuthenticated" @click="gotoLogin">Login</button>
      <button class="link" v-if="isAuthenticated && isAdmin" @click="gotoManagement">Management</button>
      <button class="link" v-if="isAuthenticated" @click="gotoLogout">Logout</button>
    </div>
  </header>

  <hr />
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  display: flex;
  place-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.logo {
  display: block;
}

.nav-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 0.5rem;
}

.link {
  align-items: center;
  background-color: transparent;
  border: 1px solid #DFDFDF;
  border-radius: 16px;
  box-sizing: border-box;
  color: #9f9f9f;
  cursor: pointer;
  display: flex;
  font-size: 18px;
  justify-content: center;
  line-height: 28px;
  padding: 8px;
  text-decoration: none;
  transition: all .2s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 100%;
}

  .link:active,
  .link:hover {
    outline: 0;
  }

  .link:hover {
    background-color: #FFFFFF;
    color: black;
    border-color: rgba(0, 0, 0, 0.19);
  }

</style>
