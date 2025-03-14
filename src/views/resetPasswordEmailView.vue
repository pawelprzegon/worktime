<script setup>
import {ref, watch} from 'vue';
import {resetPasswordURL} from '@/composables/fetchers.js';
import {useAlertStore} from "@/stores/alertStore.js";
import Alert from "@/components/Alert.vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n();
const alert = useAlertStore()
const email = ref('')
const loading = ref(false);
const emailValid = ref(true);

const handleResetPasswordEmail = async () => {
  loading.value = true;

  try {
    const response = await resetPasswordURL(email.value)

    alert.show(response.status, response.message)
  } catch(error) {
    alert.show("error", error.message)
  } finally {
    email.value = ''
    loading.value = false;
  }

};

watch(() => email.value, (newValue) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  emailValid.value = emailPattern.test(newValue);
});

</script>

<template>
  <Alert/>

  <section class="bg-gray-50 dark:bg-primary">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div class="flex flex-col justify-center">
            <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">{{ t('resetPassword.emailView.textHeader') }}</h1>
            <p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">{{ t('resetPassword.emailView.textInfo') }}</p>
            <a href="#" class="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">{{ t('resetPassword.emailView.textMore') }}
                <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>
        </div>
        <div>
            <div class="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-neutral-900">
                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">
                    {{ t('resetPassword.emailView.header') }}
                </h2>
                <form @submit.prevent="handleResetPasswordEmail" class="max-w-md mx-auto">
                  <div class="relative z-0 w-full mb-5 group">
                      <input
                          v-model="email"
                          type="email"
                          name="floating_email"
                          id="floating_email"
                          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          :class="{
                            'dark:border-red-500 focus:border-red-600 dark:focus:border-red-500 ' : !emailValid
                          }"
                          placeholder=" "
                          required
                      />
                      <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{{ t('common.emailPlaceholder') }}</label>
                      <span v-if="!emailValid" class="text-red-400 text-xs">{{ t('common.invalid.emailFormat') }}</span>
                  </div>
                  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{ t('common.submitButton') }}</button>
                </form>
            </div>
        </div>
    </div>
</section>

</template>

<style scoped>

</style>
