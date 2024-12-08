import { ref } from "vue";

export const useModal = () => {
  const isModalActive = ref(false);

  const toggleModal = () => {
    isModalActive.value = !isModalActive.value;
  };

  return {
    isModalActive,
    toggleModal,
  };
};