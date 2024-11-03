<script setup>
  import { useRouter } from "vue-router";
  import {onMounted, ref} from 'vue'
  import { isAuthenticated, isAdmin, logout } from '@/auth.js';
  import {getMe} from "@/fetchers.js";
  import CustomButton from "@/components/utils/CustomButton.vue";

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
      userName.value = `${response.first_name} ${response.last_name}`
    } catch (error) {
      console.log(error)
    }
  }

  onMounted(() => {
  if (isAuthenticated.value) {
    getMeData();
  }
});


</script>

<template>
  <header id="header">
    <img alt="Vue logo" class="logo" src="./assets/img/beb.webp" />
    <div class="nav">
      <small class="nav-user" v-if="isAuthenticated">logged: {{userName}}</small>
      <div class="nav-buttons">
        <CustomButton
            label="Dashboard"
            :margin="10"
            :padding="3"
            :width="120"
            @click="gotoDash"
        ></CustomButton>
        <CustomButton
            v-if="!isAuthenticated"
            label="Login"
            :margin="10"
            :padding="3"
            :width="120"
            @click="gotoLogin"
        ></CustomButton>
        <CustomButton
            v-if="isAuthenticated && isAdmin"
            label="Management"
            :margin="10"
            :padding="3"
            :width="120"
            @click="gotoManagement"
        ></CustomButton>
        <CustomButton
            v-if="isAuthenticated"
            label="Shifts"
            :margin="10"
            :padding="3"
            :width="120"
            @click="gotoPanel"
        ></CustomButton>
        <CustomButton
            v-if="isAuthenticated"
            label="Logout"
            :margin="10"
            :padding="3"
            :width="120"
            @click="gotoLogout"
        ></CustomButton>
      </div>

    </div>


  </header>

  <hr />
  <main id="main">
    <RouterView />
  </main>

  <hr />
  <footer id="footer">
    <CustomButton
        class="link"
        v-if="!isAuthenticated"
        label="SignUp"
        :margin="10"
        :padding="3"
        :width="120"
        @click="gotoSignUp"
    >SignUp</CustomButton>
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
  width:90px;
  height:70px
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

@media (max-width: 1300px) {
  .logo {
    width:65px;
    height:50px
  }
}

</style>
