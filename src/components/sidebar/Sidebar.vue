<script setup>

import {useAuthStore} from "@/stores/authStore.js";
import {useMenuSidebarStore, useSidebarStore} from "@/stores/sidebarStore.js";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";

const authStore = useAuthStore();
const menuSideBarStore = useMenuSidebarStore();
const sideBarStore = useSidebarStore();

const { t } = useI18n();
const router = useRouter()


const goToDay = () => {
  router.push('/day')
}

const selectCard = (newSelect) => {
  sideBarStore.setSelectedCard(newSelect)

}

</script>

<template>


  <aside
      v-if="authStore.isAuthenticated"
      id="logo-sidebar"
      :class="{ 'translate-x-0': menuSideBarStore.isOpen }"
      class="fixed top-0 left-0 z-30 w-64 h-screen pt-32 transition-transform -translate-x-full bg-white border-r border-neutral-200 lg:translate-x-0 dark:bg-neutral-900 dark:border-none shadow-xl"
      aria-label="Sidebar"
  >
     <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-neutral-900 shadow-2xl">
        <ul class="space-y-2 font-medium">
           <li>
              <a @click="selectCard('day'); goToDay()"
                 class="flex items-center p-2 text-neutral-900 rounded-lg dark:text-white group hover:cursor-pointer"
                  :class="sideBarStore.selectedCard === 'day'
                    ? 'text-white bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-700'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'"
                 >
                 <img
                     src="@/assets/img/sidebar/day.png"
                     alt="day"
                     :class="sideBarStore.selectedCard === 'day' ? 'filter-invert-100 dark:filter-invert-100' : 'filter-invert-0 dark:filter-invert-100'"
                 />
                 <span class="ms-3">{{ t('sidebar.day') }}</span>
              </a>
           </li>
           <li>
              <a @click="selectCard('record')"
                 class="flex items-center p-2 text-neutral-900 rounded-lg dark:text-white group hover:cursor-pointer"
                 :class="sideBarStore.selectedCard === 'record'
                    ? 'text-white bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-700'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'"
              >
                 <img
                     src="@/assets/img/sidebar/record.png"
                     alt="record"
                     :class="sideBarStore.selectedCard === 'record' ? 'filter-invert-100 dark:filter-invert-100' : 'filter-invert-0 dark:filter-invert-100'"
                 />
                 <span class="flex-1 ms-3 whitespace-nowrap">{{ t('sidebar.record') }}</span>
              </a>
           </li>
           <li>
              <a @click="selectCard('overtime')"
                 class="flex items-center p-2 text-neutral-900 rounded-lg dark:text-white group hover:cursor-pointer"
                 :class="sideBarStore.selectedCard === 'overtime'
                    ? 'text-white bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-700'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'"
              >
                 <img
                     src="@/assets/img/sidebar/overtime.png"
                     alt="overtime"
                    :class="sideBarStore.selectedCard === 'overtime' ? 'filter-invert-100 dark:filter-invert-100' : 'filter-invert-0 dark:filter-invert-100'"
                 />
                 <span class="flex-1 ms-3 whitespace-nowrap">{{ t('sidebar.overtime') }}</span>
              </a>
           </li>
           <li>
              <a @click="selectCard('holiday')"
                 class="flex items-center p-2 text-neutral-900 rounded-lg dark:text-white group hover:cursor-pointer"
                 :class="sideBarStore.selectedCard === 'holiday'
                    ? 'text-white bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-700'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'"
              >
                 <img
                     src="@/assets/img/sidebar/holidays.png"
                     alt="holiday"
                     :class="sideBarStore.selectedCard === 'holiday' ? 'filter-invert-100 dark:filter-invert-100' : 'filter-invert-0 dark:filter-invert-100'"
                 />
                 <span class="flex-1 ms-3 whitespace-nowrap">{{ t('sidebar.holiday') }}</span>
              </a>
           </li>

            <li>
                <a @click="selectCard('settings')"
                   class="flex items-center p-2 text-neutral-900 rounded-lg dark:text-white group hover:cursor-pointer"
                   :class="sideBarStore.selectedCard === 'settings'
                      ? 'text-white bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-700'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'"
                >
                   <img
                       src="@/assets/img/sidebar/settings.png"
                       alt="holiday"
                       :class="sideBarStore.selectedCard === 'settings' ? 'filter-invert-100 dark:filter-invert-100' : 'filter-invert-0 dark:filter-invert-100'"
                   />
                   <span class="flex-1 ms-3 whitespace-nowrap">{{ t('sidebar.settings') }}</span>
                </a>
             </li>

        </ul>
     </div>
  </aside>

</template>

<style scoped>

</style>