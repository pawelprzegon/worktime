<script setup>
import {ref} from 'vue';
import { useRoute } from 'vue-router';
import {resetPasswordURL} from '@/composables/fetchers.js';
import Spinner from "@/components/Spinner.vue";
import {useAlertStore} from "@/stores/alertStore.js";
import Alert from "@/components/Alert.vue";

const alert = useAlertStore()
const email = ref('')
const loading = ref(false);


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
</script>

<template>
  <Alert/>
  <section class="flex justify-center items-start my-36">

     <div
         v-if="loading"
         class="place-items-center"
     >
       <h1 class="block mb-10">Sending email..</h1>
       <div class="loading-spinner">
         <Spinner />
       </div>
    </div>

    <form
        v-if="!loading"
        @submit.prevent="handleResetPasswordEmail"
        class="flex flex-col w-[300px] min-h-[300px] p-4 bg-secondary shadow-xl rounded-xl"
    >
      <h1 class="text-beb text-center text-2xl mb-10">Send reset url</h1>

      <h3 class="mb-3">Please enter your email address associated with your account to receive a password reset link.</h3>

      <div class="flex flex-col justify-center items-center space-y-4">

        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="email address"
          required
          class="w-3/4 py-2 px-1
          bg-third text-gray-300
          border-solid border border-zinc-600 rounded-lg focus:border-beb
          placeholder-font-third
          outline-none"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="bg-third mt-auto py-2 px-4
        text-black
        border border-third rounded-md
        hover:bg-beb hover:text-white"
      >
        {{ loading ? 'SENDING...' : 'SEND' }}
      </button>

    </form>
  </section>

</template>

<style scoped>

</style>
