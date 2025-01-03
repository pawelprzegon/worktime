<script setup>
import {ref, onMounted, computed} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {resetPassword, validateResetPasswordURL} from '@/composables/fetchers.js';
import Spinner from "@/components/Spinner.vue";
import {useAlertStore} from "@/stores/alertStore.js";
import Alert from "@/components/Alert.vue";

const alert = useAlertStore()
const password = ref('');
const confirm = ref('');
const loading = ref(true);

const tokenValid = ref({
  token: null,
  status: false,
  message: 'Token Validation...',
});

const route = useRoute();
const router = useRouter();

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
    console.log('test', loading.value)
  }
};

const passwordsMatch = computed(() => {
  return password.value === confirm.value;
});

onMounted(async () => {
  await checkTokenValidation();
});

const handleResetPassword = async () => {
  const response = await resetPassword(tokenValid.value.token, password.value)
  alert.show(response.status, response.message)
};
</script>

<template>
  <Alert/>
  <section
      class="flex justify-center items-center h-full"
  >

     <div
         v-if="loading"
         class="place-items-center"
     >
       <h1 class="block mb-10">{{tokenValid.message}}</h1>
       <div class="loading-spinner">
         <Spinner />
       </div>
    </div>

    <div
        v-if="!loading && !tokenValid.status"
    >
      <h1>{{tokenValid.message}}</h1>
    </div>


    <form
        v-if="!loading && tokenValid.status"
        @submit.prevent="handleResetPassword"
        class="flex flex-col w-[300px] min-h-[500px] p-4 bg-secondary shadow-xl rounded-xl"
    >
      <h1 class="text-beb text-center text-2xl mb-10">Password Reset</h1>
      <div class="flex flex-col justify-center items-center space-y-4">

        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="new password"
          required
          class="w-3/4 py-2 px-1
          bg-third text-gray-300
          border-solid border border-zinc-600 rounded-lg focus:border-beb
          placeholder-font-secondary
          outline-none"
        />
        <input
          v-model="confirm"
          type="password"
          id="confirm"
          placeholder="confirm new password"
          required
          class="
          w-3/4 py-2 px-1
          bg-third text-gray-300
          border-solid border border-zinc-600 rounded-lg focus:border-beb
          placeholder-font-secondary
          outline-none"
        />

        <p v-if="!passwordsMatch" class="text-red-500 text-sm">
          Passwords do not match.
        </p>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="bg-third mt-auto py-2 px-4
        text-black
        border border-third rounded-md
        hover:bg-beb hover:text-white"
      >
        {{ loading ? 'RESETTING...' : 'RESET' }}
      </button>

    </form>
  </section>

</template>

<style scoped>

</style>
