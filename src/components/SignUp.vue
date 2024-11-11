<script setup>
import { ref } from 'vue';
import {registerUser, saveAvatar} from "@/fetchers.js";
import { useRouter } from "vue-router";

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
  if (file && file.type === 'image/png') {
    form.value.avatar = file;
  } else {
    alert('Please upload a PNG file');
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

  <section class="signup-section">

    <form @submit.prevent="handleSubmit">
      <h1 class="form-label">Sign up</h1>
      <div>
        <input v-model="form.first_name" type="text" placeholder="first name" id="first_name" required />
        <input v-model="form.last_name" type="text" placeholder="last name" id="last_name" required />
        <input v-model="form.email" type="email" placeholder="email" id="email" required />
        <input v-model="form.username" type="text" placeholder="username" id="username" autocomplete="current-username" required />
        <input v-model="form.password" type="password" placeholder="password" autocomplete="current-password" id="password" required />
        <label for="avatar">Upload avatar:</label>
        <input type="file" id="avatar" @change="handleFileChange" accept=".png, .jpg, .jpeg, .gif, .svg"/>
      </div>


      <button type="submit">SIGN UP</button>
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

.form-label {
  font-weight: bolder;
  margin: 1rem auto;
  color: lightgray;
}

div {
  margin-bottom: 10px;
}

label {

  margin-bottom: 5px;
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
}

button:hover {
  background-color: var(--vt-c-black);
  color: lightgray;
}
</style>
