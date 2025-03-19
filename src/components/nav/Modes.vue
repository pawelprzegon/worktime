<script setup>
import {computed, onMounted, ref} from 'vue'
import dayImage from "@/assets/img/navbar/day.png";
import nightImage from "@/assets/img/navbar/night.png";
import {useThemeStore} from "@/stores/styleTheme.ts";

const theme = useThemeStore()



onMounted(() => {
  if (!localStorage.getItem("theme")) {
    theme.isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  if (theme.isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});

const imageSrc = computed(() => (theme.isDark ? dayImage : nightImage));

</script>

<template>

<div data-dial-init ref="langMenuRef" class="flex items-center">
    <button
        @click="theme.toggleDarkMode()"
        type="button"
        data-dial-toggle="speed-dial-menu-top-right"
        aria-controls="speed-dial-menu-top-right"
        aria-expanded="false"
        class="flex items-center justify-center rounded-full w-12 h-12"
    >
      <img :src="imageSrc"
           alt="actualLocale"
           class="filter-invert-0 dark:filter-invert-100 rounded-2xl cursor-pointer hover:scale-105" title="darkMode"/>
    </button>
</div>


</template>

<style scoped>

</style>