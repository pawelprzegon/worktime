import { ref } from "vue";
import { defineStore } from "pinia";

export const useAlertStore = defineStore('alertStore', () => {
  const status = ref(null);
  const message = ref('');
  let timeoutId = null;

  const show = (newStatus, newMessage) => {
    status.value = newStatus;
    message.value = newMessage;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      status.value = null;
      message.value = '';
    }, 5000);
  };


  return {
    status,
    message,
    show,
  };
});