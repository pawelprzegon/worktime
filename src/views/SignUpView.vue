<script setup>
import {ref, inject, watch} from 'vue';
import {registerUser, saveAvatar} from "@/composables/fetchers.js";
import { useRouter } from "vue-router";
import {useAlertStore} from "@/stores/alertStore.js";

const alert = useAlertStore()
const router = useRouter()
const form = ref({
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  confirmedPassword: '',
  avatar: 'default.png'
});


const emailValid = ref(true);
const passwordValid = ref(true);
const passwordsMatch = ref(true);


const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.avatar = file;
  } else {
    alert.show('warning', 'None file attached');
  }
};

const handleSubmit = async () => {
  const avatar_file = form.value.avatar
  form.value.avatar = avatar_file.name
  const response = await registerUser(form.value)
  const avatarSaveResponse = await saveAvatar(response.id, avatar_file)
  router.push('/')

};

watch(() => form.value.email, (newValue) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  emailValid.value = emailPattern.test(newValue);
});

watch(() => form.value.password, (newValue) => {
  passwordValid.value = newValue.length >= 6; // Przykład minimalnej długości hasła
});

watch([() => form.value.password, () => form.value.confirmedPassword], () => {
  passwordsMatch.value = form.value.password === form.value.confirmedPassword;
});
</script>

<template>
<section class="bg-gray-50 dark:bg-transparent">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div class="flex flex-col justify-center">
            <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">We invest in the world’s potential</h1>
            <p class="mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.</p>
            <a href="#" class="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Read more about our app
                <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>
        </div>
        <div>
            <div class="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-neutral-900">
                <h2 class="text-2xl font-bold text-neutral-900 dark:text-white">
                    Sign up to TimeLog
                </h2>
                <!-- #TODO: Handle validate form -->
                <form @submit.prevent="handleSubmit" class="max-w-md mx-auto">
                  <div class="relative z-0 w-full mb-5 group">
                      <input
                          v-model="form.email"
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
                      <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                      <span v-if="!emailValid" class="text-red-400 text-xs">Invalid email format</span>
                  </div>

                  <div class="relative z-0 w-full mb-5 group">
                      <input
                          v-model="form.username"
                          type="password"
                          name="floating_username"
                          id="floating_username"
                          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          required
                      />
                      <label for="floating_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username</label>
                  </div>

                  <div class="relative z-0 w-full mb-5 group">
                      <input
                          v-model="form.password"
                          type="password"
                          name="floating_password"
                          id="floating_password"
                          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          :class="{
                            'dark:border-red-500 focus:border-red-600 dark:focus:border-red-500 ' : !passwordsMatch
                          }"
                          placeholder=" "
                          required
                      />
                      <label
                          for="floating_password"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          :class="{
                          'text-red-500 dark:text-red-400 peer-focus:text-red-600 peer-focus:dark:text-red-600' : !passwordsMatch
                          }"
                      >Password</label>
                      <span v-if="!passwordValid" class="text-red-400 text-xs">Password must be at least 6 characters long</span>
                  </div>

                  <div class="relative z-0 w-full mb-5 group">
                      <input
                          v-model="form.confirmedPassword"
                          type="password"
                          name="repeat_password"
                          id="floating_repeat_password"
                          class="block bg- py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          :class="{
                            'dark:border-red-500 focus:border-red-600 dark:focus:border-red-500 ' : !passwordsMatch
                          }"
                          placeholder=" "
                          required
                      />
                      <label
                          for="floating_repeat_password"
                          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          :class="{
                          'text-red-500 dark:text-red-400 peer-focus:text-red-600 peer-focus:dark:text-red-600' : !passwordsMatch
                          }"
                      >Confirm password</label>
                      <p v-if="!passwordsMatch" id="outlined_error_help" class="mt-2 text-xs text-red-600 dark:text-red-400"><span class="font-xs">Oh, snapp!</span> Passwords do not match.</p>
                  </div>

                  <div class="grid md:grid-cols-2 md:gap-6">
                    <div class="relative z-0 w-full mb-5 group">
                        <input v-model="form.first_name"  type="text" name="floating_first_name" id="floating_first_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label for="floating_first_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                    </div>
                    <div class="relative z-0 w-full mb-5 group">
                        <input v-model="form.last_name"  type="text" name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                    </div>
                  </div>
                  <div class="relative z-0 w-full mb-5 group">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Upload avatar file</label>
                    <input
                        @change="handleFileChange"
                        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-neutral-100 dark:text-neutral-100 focus:outline-none dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400"
                        aria-describedby="user_avatar_help"
                        id="user_avatar"
                        type="file"
                    >
                    <div class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="user_avatar_help">A profile picture is useful to confirm your are logged into your account</div>
                  </div>
                  <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
        </div>
    </div>
</section>

</template>

<style scoped>

</style>
