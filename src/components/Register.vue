<script setup>
import { ref } from 'vue';
import { registerUser } from "@/fetchers.js";
import { useRouter } from "vue-router";

const router = useRouter()
const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  username: '',
  password: ''
});

const handleSubmit = async () => {
  console.log('Form data:', form.value);
  const response = await registerUser(form.value)
  console.log(response)

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
      <input v-model="form.username" type="text" id="username" required />
    </div>

    <div>
      <label for="password">Password</label>
      <input v-model="form.password" type="password" id="password" required />
    </div>

    <div>
      <label for="avatar">Avatar</label>
      <input v-model="form.avatar" type="text" id="avatar" value="default.png"/>
    </div>

    <button type="submit">Create User</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 0 auto;
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
