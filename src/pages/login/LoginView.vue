<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import {loginFetch} from '@/composables/fetchers.js'
import { useAuthStore } from '@/stores/authStore.js';

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

</script>

<template>
  <section class="flex justify-center items-center h-full">
    <form
      @submit.prevent="handleLogin"
      class="flex flex-col w-[300px] min-h-[450px] p-4 bg-secondary shadow-xl rounded-xl"
    >
      <h1 class="text-beb text-center text-2xl mb-10">Login</h1>
      <div class="flex flex-col justify-center items-center space-y-4">
        <input
          v-model="username"
          type="text"
          id="username"
          placeholder="username"
          required
          class="w-3/4  bg-transparent border-b border-zinc-900 text-gray-300 placeholder-font-secondary focus:border-zinc-600 outline-none py-2 px-1"
        />

        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="password"
          required
          class="w-3/4 bg-transparent border-b border-zinc-900 text-gray-300 placeholder-font-secondary focus:border-zinc-600 outline-none py-2 px-1"
        />
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="mt-auto py-2 px-4 bg-x-secondary text-black hover:bg-beb hover:text-white rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
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
