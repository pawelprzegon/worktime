<script setup>
  import { useRouter } from "vue-router";
  import {onMounted, ref} from 'vue'
  import { isAuthenticated, isAdmin, logout } from '@/auth.js';
  import {getMe} from "@/fetchers.js";

  const router = useRouter()
  const userName = ref('');

  const gotoSignUp = () => {
    router.push('/signup')
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

  const gotoPanel = () => {
    router.push('/user-panel')
  }

  const getMeData = async () => {
    try{
      const response =  await getMe()
      console.log(`${response.first_name} ${response.last_name}`)
      userName.value = `${response.first_name} ${response.last_name}`
    } catch (error) {
      console.log(error)
    }
  }

  onMounted(() => {
  if (isAuthenticated) {
    getMeData();
  }
});


</script>

<template>
  <header id="header">
    <img alt="Vue logo" class="logo" src="./assets/img/beb.webp" width="90" height="70" />
    <div class="nav">
      <small class="nav-user" v-if="isAuthenticated">logged: {{userName}}</small>
      <div class="nav-buttons">
        <button class="link" @click="gotoDash">Dashboard</button>
        <button class="link" v-if="!isAuthenticated" @click="gotoLogin">Login</button>
        <button class="link" v-if="isAuthenticated && isAdmin" @click="gotoManagement">Management</button>
        <button class="link" v-if="isAuthenticated" @click="gotoPanel">Shifts</button>
        <button class="link" v-if="isAuthenticated" @click="gotoLogout">Logout</button>
      </div>

    </div>


  </header>

  <hr />
  <main id="main">
    <RouterView />
  </main>

  <hr />
  <footer id="footer">
    <button class="link" v-if="!isAuthenticated" @click="gotoSignUp">SignUp</button>
  </footer>
</template>

<style scoped>

header {
  display: grid;
  grid-template-columns: 100px auto;
  margin-bottom: 1rem;
}

.logo {
  display: block;
}

.nav {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

.nav-buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
}

.link {
  align-items: center;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 16px;
  box-sizing: border-box;
  color: #9f9f9f;
  cursor: pointer;
  display: flex;
  font-size: 18px;
  justify-content: center;
  line-height: 28px;
  margin: 4px;
  text-decoration: none;
  transition: all .2s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 120px;
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
