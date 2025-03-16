<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import {loginFetch} from '@/composables/fetchers.js'
import { useAuthStore } from '@/stores/authStore.js';
import CustomTextButton from "@/components/CustomTextButton.vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n();
const authStore = useAuthStore();

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const router = useRouter()

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  const formData = new URLSearchParams();
  formData.append('username', username.value);
  formData.append('password', password.value);
  try {
    const data = await loginFetch(formData)
    authStore.setToken(data.access_token)
    await authStore.getUserMetadata()

    await router.push('/day')

  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

const redirectGenerateChangePasswordURL = () => {
  router.push('/request-password-reset')
}

const goToSignIn = () => {
  router.push('/signup')
}

</script>

<template>

<section class="bg-gray-50 dark:bg-transparent">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div class="flex flex-col justify-center">
            <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">{{ t('login.text.header') }}</h1>
            <p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">{{ t('login.text.info') }}</p>
            <a href="#" class="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">{{ t('login.text.more') }}
                <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>
        </div>
        <div>
            <div class="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-neutral-900">
                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">
                    {{ t('login.form.header') }}
                </h2>
                <form @submit.prevent="handleLogin" class="mt-8 space-y-6" action="#">
                    <div>
                        <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ t('login.form.usernameLabel') }}</label>
                        <input v-model="username" type="text" name="username" id="username" class="bg-gray-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               :placeholder="t('login.form.usernamePlaceholder')"
                               required />
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">{{ t('login.form.passwordLabel') }}</label>
                        <input v-model="password" type="password" name="password" id="password"
                               :placeholder="t('login.form.passwordPlaceholder')"
                               class="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" name="remember" type="checkbox" class="w-4 h-4 border-neutral-300 rounded-sm bg-neutral-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-neutral-800 dark:bg-neutral-700 dark:border-neutral-600" />
                        </div>
                        <div class="ms-3 text-sm">
                        <label for="remember" class="font-medium text-neutral-500 dark:text-neutral-400">{{ t('login.form.rememberDevice') }}</label>
                        </div>
                        <a @click="redirectGenerateChangePasswordURL" class="ms-auto text-sm font-medium  text-blue-600 hover:underline dark:text-blue-500 hover:cursor-pointer">{{ t('login.form.lostPassword') }}</a>
                    </div>
                    <button type="submit" class="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{ t('login.form.submitText') }}</button>
                    <div class="text-sm font-medium text-neutral-900 dark:text-white">
                        {{ t('login.form.notRegisterQuestion') }} <a @click="goToSignIn" class="text-blue-600 hover:underline hover:cursor-pointer dark:text-blue-500">{{ t('login.form.createAccountText') }}</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>


</template>

<style scoped>

</style>
