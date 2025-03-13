<script setup>
import {onMounted, ref} from 'vue'
import { useI18n } from 'vue-i18n';
import {onClickOutside} from "@vueuse/core";

const isLangMenuOpen = ref(false)
const actualLocale = ref('en')
const langMenuRef = ref(null)

const { locale } = useI18n();


const openDropdown = () => {
  isLangMenuOpen.value = !isLangMenuOpen.value
}

const changeLocale = (newLocale) => {
  localStorage.setItem('locales', newLocale);
  actualLocale.value = newLocale;
  locale.value = newLocale
  openDropdown()
}

onMounted(() => {
  const savedLocale = localStorage.getItem('locales')
  if (savedLocale) {
    actualLocale.value = savedLocale
    locale.value = savedLocale
  }
})

const getLocaleImage = () => {
  return `src/assets/locales/${actualLocale.value}.png`
}

onClickOutside(langMenuRef, () => {
  isLangMenuOpen.value = false;
});

</script>

<template>

<div data-dial-init ref="langMenuRef" class="flex items-center">
    <button
        @click="openDropdown"
        type="button"
        data-dial-toggle="speed-dial-menu-top-right"
        aria-controls="speed-dial-menu-top-right"
        aria-expanded="false"
        class="flex items-center justify-center rounded-full w-12 h-12"
        :class="{'focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-500' : isLangMenuOpen}"
    >
        <img :src="getLocaleImage()"  alt="actualLocale" class="rounded-2xl cursor-pointer hover:scale-105 h-10" title="pl"/>
        <span class="sr-only">Locales Menu</span>
    </button>
    <div class="fixed top-20 end-7">
      <div v-if="isLangMenuOpen" id="speed-dial-menu-top-right" class="flex flex-col items-center mt-4 space-y-2 gap-2 bg-blue-500 p-2 rounded">
          <img src="@/assets/locales/pl.png" alt="pl" class="rounded-2xl cursor-pointer hover:scale-105 hover:ring-2 hover:ring-white h-8" @click="changeLocale('pl')" title="pl"/>
          <img src="@/assets/locales/en.png" alt="en" class="rounded-2xl cursor-pointer hover:scale-105 hover:ring-2 hover:ring-white h-8" @click="changeLocale('en')" title="en"/>
          <img src="@/assets/locales/de.png" alt="de" class="rounded-2xl cursor-pointer hover:scale-105 hover:ring-2 hover:ring-white h-8" @click="changeLocale('de')" title="de"/>
          <div id="tooltip-download" role="tooltip" class="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
              DE
              <div class="tooltip-arrow" data-popper-arrow></div>
          </div>

      </div>
    </div>

</div>


</template>

<style scoped>

</style>