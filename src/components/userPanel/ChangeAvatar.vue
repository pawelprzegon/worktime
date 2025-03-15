<script setup>
import { validateAvatarFile, uploadAvatar } from "@/composables/avatarHandler.js";
import { useAuthStore } from "@/stores/authStore.js";
import "@/assets/modal.css";
import {useAlertStore} from "@/stores/alertStore.js";
import {useI18n} from "vue-i18n";
import {ref} from "vue";

const authStore = useAuthStore();
const alert = useAlertStore()

const previewUrl = ref("");
const pickedFile = ref(null)
const { t } = useI18n();

const uploadFile = async () => {
  try {
    const response = await uploadAvatar(authStore.user.id, pickedFile.value);
    alert.show(response.status, response.message);
    authStore.getUserMetadata()

  } catch (error) {
    alert.show("error", error.detail || "An unexpected error occurred.");
  }
}

const deletePreviewFile = () => {
  previewUrl.value = ''
  pickedFile.value = null
}

const handleFileChange = async (event) => {
  const file = event.target.files[0];

  if (file) {
    pickedFile.value = file
    const validationError = validateAvatarFile(file);

    if (validationError && typeof(validationError) !== Object) {

      previewUrl.value = URL.createObjectURL(file);
    } else if (validationError && typeof(validationError) === Object) {
      alert.show(validationError.type, validationError.message);
    }
  }
};

</script>

<template>
      <section class="grid grid-cols-2 max-w-full md:max-w-md">
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white">
            <input @change="handleFileChange" type="file" hidden />
            <div class="flex w-fit text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none hover:cursor-pointer focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{ t('userForm.fields.chooseFile') }}</div>
          </label>
        <div @click="uploadFile" v-if="previewUrl" class="flex w-fit m-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none hover:cursor-pointer focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{ t('userAccount.uploadFile') }}</div>

        </div>
        <div class="grid">
            <p>{{ t('userAccount.uploadFilePreview') }}:</p>

            <button
              @click="deletePreviewFile"
              type="button"
              class="hover:scale-102 w-6 h-6 place-self-end"
              :class="{ 'invisible': !previewUrl }"
            >
              <img src="@/assets/img/delete.png" alt="delete" />
            </button>

            <img
              v-if="previewUrl"
              :src="previewUrl"
              alt="preview"
              class="h-24 w-24 md:h-32 md:w-32 object-cover rounded-full m-auto"
            />

            <img
              v-else
              class="h-24 w-24 md:h-32 md:w-32 object-cover rounded-full m-auto"
              src="@/assets/img/avatar-frame.jpg"
              alt="image description"
            />
          </div>

      </section>
</template>

<style scoped>

</style>
