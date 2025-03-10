<script setup>
import { ref, inject } from 'vue';
import {registerUser, saveAvatar} from "@/composables/fetchers.js";
import { useRouter } from "vue-router";
import {useAlertStore} from "@/stores/alertStore.js";

const alert = useAlertStore()
const router = useRouter()
const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  username: '',
  password: '',
  avatar: 'default.png'
});

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
  const avatarSaveResponse = saveAvatar(response.id, avatar_file)

  router.push('/')

};
</script>

<template>

  <section class="flex justify-center items-start my-36">

    <form
        @submit.prevent="handleSubmit"
        class="flex flex-col w-[300px] min-h-[500px] p-4 bg-secondary shadow-xl rounded-xl"
    >
      <h1 class="text-beb text-center text-2xl mb-10">Sign up</h1>
      <div class="flex flex-col justify-center items-center">
        <input
          v-model="form.first_name"
          class="
            w-3/4 py-2 px-1 my-1
            placeholder-font-third
            bg-third text-gray-100
            border-solid border border-zinc-600 rounded-lg
            focus:border-beb
            outline-none
          "
          type="text"
          placeholder="first name"
          id="first_name"
          required
        />
        <input
          v-model="form.last_name"
          class="
            w-3/4 py-2 px-1 my-1
            placeholder-font-third
            bg-third text-gray-100
            border-solid border border-zinc-600 rounded-lg
            focus:border-beb
            outline-none
          "
          type="text"
          placeholder="last name"
          id="last_name"
          required
        />
        <input
          v-model="form.email"
          class="
            w-3/4 py-2 px-1 my-1
            placeholder-font-third
            bg-third text-gray-100
            border-solid border border-zinc-600 rounded-lg
            focus:border-beb
            outline-none
          "
          type="email"
          placeholder="email"
          id="email"
          required
        />
        <input
          v-model="form.username"
          class="
            w-3/4 py-2 px-1 my-1
            placeholder-font-third
            bg-third text-gray-100
            border-solid border border-zinc-600 rounded-lg
            focus:border-beb
            outline-none
          "
          type="text"
          placeholder="username"
          id="username"
          autocomplete="current-username"
          required
        />
        <input
          v-model="form.password"
          class="
            w-3/4 py-2 px-1 my-1
            placeholder-font-third
            bg-third text-gray-100
            border-solid border border-zinc-600 rounded-lg
            focus:border-beb
            outline-none
          "
          type="password"
          placeholder="password"
          autocomplete="current-password"
          id="password"
          required
        />
        <label
          class="
            mt-10
            text-font-third
          "
          for="avatar"
        >
          Upload avatar:
        </label>
        <input
          class="
            w-3/4 mt-2
            text-font-third
            hover:cursor-pointer
            flex flex-col m-0
          "
          type="file"
          id="avatar"
          @change="handleFileChange"
          accept=".png, .jpg, .jpeg, .gif, .svg"
        />
      </div>

      <button
          type="submit"
          class="bg-third mt-auto py-2 px-4 m-2
          text-black
          border border-third rounded-md
          hover:bg-beb hover:text-white"
      >SIGN UP</button>
    </form>

  </section>

</template>

<style scoped>

</style>
