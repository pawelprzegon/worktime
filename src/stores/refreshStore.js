import { ref } from "vue";
import { defineStore } from "pinia";

export const useRefreshStore = defineStore('refreshStore', () => {
  const status = ref(false);

  const ON = () => {
    status.value = true
  }

  const OFF = () => {
    status.value = false
  }

  return {
    status,
    ON,
    OFF
  };
});