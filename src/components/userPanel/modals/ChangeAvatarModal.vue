<script setup>
import { ref } from "vue";
import { validateAvatarFile, uploadAvatar } from "@/composables/avatarHandler.js";
import { useAuthStore } from "@/stores/authStore.js";
import Avatar from "@/components/Avatar.vue";
import "@/assets/modal.css";
import ModalWrapper from "@/components/ModalWrapper.vue";
import {useAlertStore} from "@/stores/alertStore.js";

const authStore = useAuthStore();
const alert = useAlertStore()

const props = defineProps({
  closeModal: Function,
})
const isModalOpen = ref(true);

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  const validationError = validateAvatarFile(file);

  if (validationError) {
    alert.show(validationError.type, validationError.message);
    return;
  }

  try {
    const response = await uploadAvatar(authStore.user.id, file);
    alert.show(response.status, response.message);
    closeModal()
  } catch (error) {
    alert.show("error", error.detail || "An unexpected error occurred.");
  }
};

const closeModal = () => {
  props.closeModal();
  isModalOpen.value = false;
}

</script>

<template>
  <ModalWrapper v-if="isModalOpen" :close-modal="closeModal">
      <section class="change-avatar-container">
        <Avatar
            :avatar="authStore.user.avatar"
            :static="true"
        />

        <div class="change-avatar-input">
          <label for="avatar" class="custom-file-label">Pick avatar:</label>
          <input
              type="file"
              id="avatar"
              @change="handleFileChange"
              accept=".png, .jpg, .jpeg, .gif, .svg"
              style="display: none;"
          />
        </div>
      </section>
  </ModalWrapper>
</template>

<style scoped>
.change-avatar-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  width: 450px;
  margin: auto;
  background-color: var(--color-background-soft);
  color: #fff;
  text-align: center;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 16px 20px 50px 10px #222222;
}

.custom-file-label {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--color-background);
  color: white;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}

.custom-file-label:hover {
  background-color: white;
  color: black;
}

.change-avatar-input {
  display: block;
  margin: auto;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

@media (max-width: 1300px) {
  .change-avatar-container {
    width: 400px;
  }
}

@media (max-width: 800px) {
  .change-avatar-container {
    width: 300px;
  }
}
</style>
