<script setup>
import {ref, onMounted, watch} from 'vue';
import { useRoute } from 'vue-router';
import {resetPassword, validateResetPasswordURL} from '@/composables/fetchers.js';
import {useAlertStore} from "@/stores/alertStore.js";
import Alert from "@/components/Alert.vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n();

const alert = useAlertStore();
const email = ref('');
const password = ref('');
const confirmedPassword = ref('');
const loading = ref(true);

const emailValid = ref(true);
const passwordValid = ref(true);
const passwordsMatch = ref(true);

const tokenValid = ref({
  token: null,
  status: false,
  message: 'Token Validation...',
});

const route = useRoute();

const checkTokenValidation = async () => {
  tokenValid.value.token = route.query.token;

  if (!tokenValid.value.token) {
    tokenValid.value.message = 'Token missing.';
    return;
  }

  try {
    const response = await validateResetPasswordURL(tokenValid.value.token);

    if (response.status === 'success') {
      tokenValid.value.status = true;
    } else {
      tokenValid.value.message = response.message;
    }
  } catch (error) {
    console.log(error)
    tokenValid.value.message = error.message || 'Token Validation Error';
  } finally {
    loading.value = false
  }
};

onMounted(async () => {
  await checkTokenValidation();
});

const handleResetPassword = async () => {
  loading.value = true;
  try {
    const response = await resetPassword(tokenValid.value.token, password.value);
    alert.show(response.status, response.message);
    password.value = ''
    confirm.value = ''
  } catch(error) {
    alert.show("error", error.message);
  } finally {
    loading.value = false;
  }

};

watch(() => email.value, (newValue) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  emailValid.value = emailPattern.test(newValue);
});

watch(() => password.value, (newValue) => {
  passwordValid.value = newValue.length >= 6;
});

watch([() => password.value, () => confirmedPassword.value], () => {
  passwordsMatch.value = password.value === confirmedPassword.value;
});
</script>

<template>
  <Alert/>

  <section class="bg-gray-50 dark:bg-primary">
    <div class="flex flex-col items-center justify-start px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full p-6 bg-white rounded-lg shadow md:mt-0 sm:max-w-md dark:bg-neutral-900 sm:p-8">
            <h2 class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {{ t('resetPassword.view.header') }}
            </h2>
            <form
                @submit.prevent="handleResetPassword"
                class="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
                <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ t('resetPassword.view.emailLabel') }}</label>
                    <input
                        v-model="email"
                        type="email"
                        name="email"
                        id="email"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        :class="{
                            'focus:border-red-600 dark:border-red-500  dark:focus:border-red-500 ' : !emailValid
                          }"
                        :placeholder="t('common.emailPlaceholder')"
                        required=""
                    >
                    <p v-show="!emailValid" class="text-sm font-medium text-red-500">{{ t('common.invalid.emailFormat') }}</p>
                </div>
                <div>
                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ t('resetPassword.view.passwordLabel') }}</label>
                    <input
                        v-model="password"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        :class="{
                            'dark:border-red-500 focus:border-red-600 dark:focus:border-red-500 ' : !passwordsMatch || !passwordValid,
                          }"
                        required=""
                    >
                  <p v-show="!passwordValid" class="text-sm font-medium text-red-500">{{ t('common.invalid.passwordToShort') }}</p>
                  <p v-show="!passwordsMatch" class="text-sm font-medium text-red-500">{{ t('common.invalid.passwordDontMatch') }}</p>
                </div>
                <div>
                    <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ t('resetPassword.view.confirmPasswordLabel') }}</label>
                    <input
                        v-model="confirmedPassword"
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        placeholder="••••••••"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        :class="{
                            'dark:border-red-500 focus:border-red-600 dark:focus:border-red-500 ' : !passwordsMatch
                          }"
                        required=""
                    >
                    <p v-show="!passwordsMatch" class="text-sm font-medium text-red-500">{{ t('common.invalid.passwordDontMatch') }}</p>
                </div>

                <button
                    type="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {{ t('resetPassword.view.confirmButtonLabel') }}
                </button>
            </form>
        </div>
    </div>
  </section>

</template>

<style scoped>

input:focus {
  outline: none;
}

input:active {
  outline: none;
}

</style>
