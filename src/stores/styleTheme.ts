import { ref } from "vue";
import { defineStore } from "pinia";

export const useThemeStore = defineStore('themeStore', () => {
  const isDark = ref(localStorage.getItem("theme") === "dark");

  const toggleDarkMode = () => {
      localStorage.setItem("theme", isDark.value ? "light": "dark");
      isDark.value = !isDark.value;

      if (isDark.value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

  return {
    isDark,
    toggleDarkMode
  };
});