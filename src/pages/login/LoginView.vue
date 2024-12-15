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

  <section class="login-section">

    <form @submit.prevent="handleLogin">
      <h1 class="login-label">Login</h1>
      <div>
        <input
          v-model="username"
          type="text"
          id="username"
          placeholder="username"
          required
        />

        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="password"
          required
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'LOGIN' }}
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>

  </section>

</template>

<style scoped>

form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 300px;
  min-height: 450px;
  padding: 1rem;
  background: var(--vt-c-black-mute);
  box-shadow: -4px 13px 27px 9px black;
  border-radius: 10px;
}

h1 {
  font-weight: bolder;
  margin: 1rem auto;
  color: lightgray;
  text-align: center;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid black;
  outline: none;
  color: gray;
  padding: 10px;
  margin: 5px;
  width: 100%;
}

input:focus {
  border-bottom: 1px solid gray;
}

button {
  padding: 10px;
  background-color: var(--vt-c-black-mute);
  color: gray;
  cursor: pointer;
  font-size: 16px;
  border-radius: 3px;
  border: solid 1px var(--vt-c-black);
  margin-top: auto;
}

button:hover {
  background-color: var(--vt-c-black);
  color: lightgray;
}

button:disabled {
  background-color: #ccc;
}

.error {
  color: red;
  text-align: center;
}
</style>
