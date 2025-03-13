<script setup>


import {useAuthStore} from "@/stores/authStore.js";
import {useMenuSidebarStore} from "@/stores/sidebarStore.js";
import {useI18n} from "vue-i18n";

const authStore = useAuthStore();
const sideBarStore = useMenuSidebarStore()
const { t } = useI18n();

</script>

<template>


  <aside
      v-if="authStore.isAuthenticated"
      id="logo-sidebar"
      :class="{ 'translate-x-0': sideBarStore.isOpen }"
      class="fixed top-0 left-0 z-40 w-64 h-screen pt-28 transition-transform -translate-x-full bg-white border-r border-neutral-200 lg:translate-x-0 dark:bg-neutral-900 dark:border-none shadow-xl"
      aria-label="Sidebar"
  >
     <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-neutral-900 shadow-2xl">
        <ul class="space-y-2 font-medium">
           <li>
              <a href="#" class="flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 group">
                 <img src="@/assets/img/sidebar/mail-inbox-app.png" alt="imbox" class="filter-invert-100"/>
                 <span class="flex-1 ms-3 whitespace-nowrap">{{ t('sidebar.inbox') }}</span>
                 <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
              </a>
           </li>
           <li>
              <a href="#" class="flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 group">
                 <img src="@/assets/img/sidebar/day.png" alt="day" class="filter-invert-100"/>
                 <span class="ms-3">{{ t('sidebar.day') }}</span>
              </a>
           </li>
           <li>
              <a href="#" class="flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 group">
                 <img src="@/assets/img/sidebar/record.png" alt="record" class="filter-invert-100"/>
                 <span class="flex-1 ms-3 whitespace-nowrap">{{ t('sidebar.record') }}</span>
              </a>
           </li>
           <li>
              <a href="#" class="flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 group">
                 <img src="@/assets/img/sidebar/overtime.png" alt="overtime" class="filter-invert-100"/>
                 <span class="flex-1 ms-3 whitespace-nowrap">{{ t('sidebar.overtime') }}</span>
              </a>
           </li>
           <li>
              <a href="#" class="flex items-center p-2 text-neutral-900 rounded-lg dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 group">
                 <img src="@/assets/img/sidebar/holidays.png" alt="holiday" class="filter-invert-100"/>
                 <span class="flex-1 ms-3 whitespace-nowrap">{{ t('sidebar.holiday') }}</span>
              </a>
           </li>

        </ul>
     </div>
  </aside>

</template>

<style scoped>

</style>