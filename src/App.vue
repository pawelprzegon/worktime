<script setup>
  import { useRouter } from "vue-router";
  import {onMounted, ref, inject, watch, computed} from 'vue'
  import {getMe} from "@/fetchers.js";
  import CustomTextButton from "@/components/utils/CustomTextButton.vue";
  import {clearCache} from "@/utils.js";

  const isAuthenticated = inject('isAuthenticated')

  console.log(isAuthenticated)
  const router = useRouter()
  const userName = ref('');
  const today = ref(new Date)

  const isDashActive = computed(() => router.currentRoute.value.path === '/');
  const isLoginActive = computed(() => router.currentRoute.value.path === '/login');
  const isPrivilegedActive = computed(() => router.currentRoute.value.path === '/privileged');
  const isUserPanelActive = computed(() => router.currentRoute.value.path === '/user-panel');
  const isSignUpActive = computed(() => router.currentRoute.value.path === '/signup');

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

  const gotoPrivileged = () => {
    router.push('/privileged')
  }

  const gotoUserPanel = () => {
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

  const logout = () => {
    console.log('logout')
    if (isAuthenticated) {
      clearCache()
      isAuthenticated.status = false;
      isAuthenticated.role = null;

    } else {
      console.error('isAuthenticated is not available');
    }
  };

  watch(() => isAuthenticated.status, (newStatus) => {
    if (newStatus) {
      getMeData();
    }
  });

  onMounted(() => {
  if (isAuthenticated.status) {
    getMeData();
  }

  setInterval(() => {
    let now = new Date()
    today.value = now.toLocaleTimeString("pl-PL", {
    timeZone: "Europe/Warsaw",
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
      weekday: 'long'
  })
  }, 1000)
});


</script>

<template>
  <header id="header">
    <img alt="Vue logo" class="logo" src="./assets/img/beb.webp" />
    <div class="nav">
      <small class="nav-user" v-if="isAuthenticated.status">logged: {{userName}}</small>
      <div class="nav-buttons">
        <CustomTextButton
            label="Dashboard"
            :isActive="isDashActive"
            :margin="10"
            :padding="3"
            :width="120"
            @click="gotoDash"
        ></CustomTextButton>
        <CustomTextButton
            v-if="!isAuthenticated.status"
            label="Login"
            :isActive="isLoginActive"
            :margin="10"
            :padding="3"
            :width="120"
            @click="gotoLogin"
        ></CustomTextButton>
        <CustomTextButton
            v-if="isAuthenticated.status && isAuthenticated.role"
            label="Privileged"
            :isActive="isPrivilegedActive"
            :margin="10"
            :padding="3"
            :width="120"
            @click="gotoPrivileged"
        ></CustomTextButton>
        <CustomTextButton
            v-if="isAuthenticated.status"
            label="User Panel"
            :isActive="isUserPanelActive"
            :margin="10"
            :padding="3"
            :width="120"
            @click="gotoUserPanel"
        ></CustomTextButton>
        <CustomTextButton
            v-if="isAuthenticated.status"
            label="Logout"
            :margin="10"
            :padding="3"
            :width="120"
            @click="gotoLogout"
        ></CustomTextButton>
        <CustomTextButton
            class="link"
            v-if="!isAuthenticated.status"
            label="SignUp"
            :isActive="isSignUpActive"
            :margin="10"
            :padding="3"
            :width="120"
            @click="gotoSignUp"
        >SignUp</CustomTextButton>
      </div>

    </div>

  </header>


  <main id="main">
    <RouterView />
  </main>


  <footer id="footer">{{today}}</footer>
</template>

<style scoped>

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

#header {
  margin-bottom: 1rem;
  display: inline-flex;
  justify-content: space-between;
  border-bottom: 1px solid white;
  width: 100%;
}

#main {
  height: auto;
  overflow-x: hidden;
  overflow-y: auto;
}

#footer {
  width: 100%;
  border-top: 1px solid white;
  text-align: right;
}


@media (orientation: portrait) {
  @media (max-width: 1300px) {

    .logo {
      width:65px;
      height:50px
    }
    #header {
      height: 60px;
    }
    #footer {
      height: 50px;
    }
  }

  @media (max-width: 800px) {

    .logo {
      width: 65px;
      height: 50px
    }
    #header {
      height: 60px;
    }
    #footer {
      height: 50px;
    }
  }
}

@media (orientation: landscape) {

  @media (max-width: 1300px) {

    .logo {
      width:65px;
      height:50px
    }
    #header {
      height: 60px;
    }
    #footer {
      height: 50px;
    }
  }

  @media (max-width: 800px) {

    .logo {
      width:65px;
      height:50px
    }
    #header {
      height: 50px;
    }
    #footer {
      height: 50px;
    }

  }
}

</style>
