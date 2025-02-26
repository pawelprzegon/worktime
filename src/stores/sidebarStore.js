import { ref } from "vue";
import { defineStore } from "pinia";

export const useSidebarStore = defineStore('sidebarStore', () => {

    const isOpen = ref(false)
    const toggleSidebar = () => {
        isOpen.value = !isOpen.value
    }

  return {
    isOpen,
    toggleSidebar
  };
});