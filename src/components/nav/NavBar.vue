<script setup>

import {computed} from "vue";
import { useI18n } from "vue-i18n";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/authStore.js";
import UserMenu from "@/components/nav/UserMenu.vue";
import {useMenuSidebarStore} from "@/stores/sidebarStore.js";
import LocalesDropdown from "@/components/nav/LocalesDropdown.vue";

const sideBarStore = useMenuSidebarStore()
const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const isHomeActive = computed(() => router.currentRoute.value.path === '/');
const isLoginActive = computed(() => router.currentRoute.value.path === '/login');


const menuToggle = () => {
  sideBarStore.toggleSidebar()
}

const gotoLogin = () => {
  router.push('/login')
}

const gotoHome = () => {
  router.push('/')
}


</script>

<template>

  <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end">
<!--          SideBar open button-->
          <button
              @click="menuToggle"
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              class="inline-flex items-center p-2 text-sm text-neutral-500 rounded-lg lg:hidden hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:ring-neutral-600"
              :class="{'hidden' : !authStore.isAuthenticated}"
          >
              <span class="sr-only">Open sidebar</span>
              <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                 <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
              </svg>
           </button>
          <img
            alt="Beb logo"
            src="@/assets/img/timeLogB.svg"
            class="block w-20 md:w-24
            "
          />
        </div>
<!--        Navigation buttons-->
        <div class="inline-flex gap-2 mr-4">
<!--          Nav buttons-->
          <div class="w-full md:w-auto" id="navbar-dropdown">
            <ul class="flex flex-row justify-end font-medium p-4">

              <li v-if="!authStore.isAuthenticated">
                <a
                  @click="gotoHome"
                  :aria-current="isHomeActive ? 'page' : undefined"
                  class="block py-2 px-3 mx-1 text-white font-bold text-sm rounded-md hover:text-blue-500 hover:cursor-pointer md:text-xl"
                  :class="{'bg-blue-500 text-white hover:text-neutral-900': isHomeActive}">
                  {{ t('nav.home') }}
                </a>
              </li>

              <li v-if="!authStore.isAuthenticated">
                <a
                  @click="gotoLogin"
                  class="block py-2 px-3 mx-1 text-white font-bold text-sm rounded-md hover:text-blue-500 hover:cursor-pointer md:text-xl"
                  :class="{'bg-blue-500 text-white hover:text-neutral-900': isLoginActive}">
                  {{ t('nav.login') }}
                </a>
              </li>

            </ul>
          </div>

          <UserMenu />
          <LocalesDropdown />

        </div>


      </div>
    </div>

</template>

<style scoped>

</style>