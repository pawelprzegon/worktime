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

        <div class="flex flex-col items-center justify-center w-full p-2">
            <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p class="mb-2 text-sm text-center text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                    <p class="text-xs text-center text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" class="hidden" @change="handleFileChange" />
            </label>

        </div>

        <div class="grid p-2">
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
          <div @click="uploadFile" :class="{ 'invisible': !previewUrl }" class="flex w-fit m-3 place-self-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none hover:cursor-pointer focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{ t('userAccount.uploadFile') }}</div>
        </div>


      </section>
</template>

<style scoped>

</style>
