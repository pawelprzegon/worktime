<script setup>
  import { useRouter } from "vue-router";
  import {onMounted, ref, watch, computed} from 'vue'
  import {getMe} from "@/composables/fetchers.js";
  import CustomTextButton from "@/components/CustomTextButton.vue";
  import { useAuthStore } from '@/stores/authStore.js';
  import Alert from "@/components/Alert.vue";
  import {useAlertStore} from "@/stores/alertStore.js";

  const authStore = useAuthStore();
  const alert = useAlertStore();
  const router = useRouter();
  const userName = ref('');
  const today = ref(new Date);

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
      alert.show('error', error)
    }
  }

  const logout = () => {
    if (authStore.isAuthenticated) {
      authStore.clearToken()

    } else {
      console.error('isAuthenticated is not available');
    }
  };

  watch(() => authStore.isAuthenticated, (newStatus) => {
    if (newStatus) {
      getMeData();
    }
  });

  onMounted(() => {
  if (authStore.isAuthenticated) {
    getMeData();
  }

  setInterval(() => {
    let now = new Date()
    today.value = now.toLocaleTimeString("en-GB", {
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
  <Alert />
  <header
      id="header"
      class="mb-4 inline-flex justify-between border-b border-white w-full"
  >
    <img
        alt="Vue logo"
        src="./assets/img/beb.webp"
        class="
        block

        portrait-2xs:w-[65px] portrait-2xs:h-[55px]
        portrait-xl:w-[90px] portrait-xl:h-[70px]
        "
    />
    <div class="flex flex-col justify-between place-items-end">
      <small class="nav-user" v-if="authStore.isAuthenticated">logged: {{userName}}</small>
      <small v-if="authStore.isAuthenticated"> {{authStore.tokenExp}} </small>
      <div class="flex justify-end items-end">
        <CustomTextButton
            label="Dashboard"
            :isSelected="isDashActive"
            @click="gotoDash"
        ></CustomTextButton>
        <CustomTextButton
            v-if="!authStore.isAuthenticated"
            label="Login"
            :isSelected="isLoginActive"
            @click="gotoLogin"
        ></CustomTextButton>
        <CustomTextButton
            v-if="authStore.isAuthenticated"
            label="User Panel"
            :isSelected="isUserPanelActive"
            @click="gotoUserPanel"
        ></CustomTextButton>
        <CustomTextButton
            v-if="authStore.isAuthenticated && authStore.isAdmin"
            label="Privileged"
            :isSelected="isPrivilegedActive"
            @click="gotoPrivileged"
        ></CustomTextButton>
        <CustomTextButton
            v-if="authStore.isAuthenticated"
            label="Logout"
            @click="gotoLogout"
        ></CustomTextButton>
        <CustomTextButton
            v-if="!authStore.isAuthenticated"
            label="SignUp"
            :isSelected="isSignUpActive"
            @click="gotoSignUp"
        >SignUp</CustomTextButton>
      </div>

    </div>

  </header>


  <main id="main" class="h-auto overflow-x-hidden overflow-y-auto">
    <RouterView />
  </main>


  <footer
      id="footer"
      class="w-full border-t border-white text-right"
  >
    {{today}}
  </footer>
</template>

<style scoped>

</style>
