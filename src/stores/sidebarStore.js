import { ref } from "vue";
import { defineStore } from "pinia";

export const useSidebarStore = defineStore('sidebarStore', () => {

    const isOpen = ref(false)
    const selectedCard = ref(sessionStorage.getItem('selectedCard') || 'day')

    const toggleSidebar = () => {
        isOpen.value = !isOpen.value
    }

    const setSelectedCard = (newCard) => {
        sessionStorage.setItem('selectedCard', newCard)
        selectedCard.value = newCard
    }

  return {
    isOpen,
    selectedCard,
    setSelectedCard,
    toggleSidebar
  };
});

export const useMenuSidebarStore = defineStore('menuSideBarStore', () => {

    const isOpen = ref(false)
    const toggleSidebar = () => {
        isOpen.value = !isOpen.value
    }

  return {
    isOpen,
    toggleSidebar
  };
});