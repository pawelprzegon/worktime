<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import {loginFetch} from '@/composables/fetchers.js'
import { useAuthStore } from '@/stores/authStore.js';
import CustomTextButton from "@/components/CustomTextButton.vue";

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

    await router.push('/user-panel')

  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

const redirectGenerateChangePasswordURL = () => {
  router.push('/request-password-reset')
}

</script>

<template>
  <section class="flex justify-center items-center h-full">
    <form
      @submit.prevent="handleLogin"
      class="flex flex-col w-[300px] min-h-[500px] p-4 bg-secondary shadow-xl rounded-xl"
    >
      <h1 class="text-beb text-center text-2xl mb-10">Login</h1>
      <div class="flex flex-col justify-center items-center space-y-4">
        <input
          v-model="username"
          type="text"
          id="username"
          placeholder="username"
          required
          class="
          w-3/4 py-2 px-1
          bg-third text-gray-300
          border-solid border border-zinc-600 rounded-lg focus:border-beb
          placeholder-font-secondary
          outline-none"
        />

        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="password"
          required
          class="w-3/4 py-2 px-1
          bg-third text-gray-300
          border-solid border border-zinc-600 rounded-lg focus:border-beb
          placeholder-font-secondary
          outline-none"
        />
      </div>

      <small
          class="py-2 text-right hover:cursor-pointer hover:text-platinum"
          @click="redirectGenerateChangePasswordURL"
      >Forgot Password?</small>

      <button
        type="submit"
        :disabled="loading"
        class="bg-third mt-auto py-2 px-4
        text-black
        border border-third rounded-md
        hover:bg-beb hover:text-white"
      >
        {{ loading ? 'Logging in...' : 'LOGIN' }}
      </button>
      <p v-if="errorMessage" class="text-red-500 text-center mt-4">
        {{ errorMessage }}
      </p>
    </form>
  </section>
</template>

<style scoped>

</style>
