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
  console.log('Form data:', form.value);

  const avatar_file = form.value.avatar
  form.value.avatar = avatar_file.name
  const response = await registerUser(form.value)
  console.log(response)
  const avatarSaveResponse = saveAvatar(response.id, avatar_file)
  console.log(avatarSaveResponse)

  router.push('/')

};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="first_name">First Name</label>
      <input v-model="form.first_name" type="text" id="first_name" required />
    </div>

    <div>
      <label for="last_name">Last Name</label>
      <input v-model="form.last_name" type="text" id="last_name" required />
    </div>

    <div>
      <label for="email">Email</label>
      <input v-model="form.email" type="email" id="email" required />
    </div>

    <div>
      <label for="username">Username</label>
      <input v-model="form.username" type="text" id="username" autocomplete="current-username" required />
    </div>

    <div>
      <label for="password">Password</label>
      <input v-model="form.password" type="password" autocomplete="current-password" id="password" required />
    </div>

    <div>
      <label for="avatar">Avatar</label>
      <input type="file" id="avatar" @change="handleFileChange" accept=".png" />
    </div>


    <button type="submit">Create User</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 300px;
  height: 100%;
  margin: auto;
}

div {
  margin-bottom: 10px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  padding: 5px;
  font-size: 14px;
  width: 100%;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}
</style>
