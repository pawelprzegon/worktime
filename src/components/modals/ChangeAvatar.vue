<script setup>
import {inject, ref} from 'vue'
import { saveAvatar } from "@/fetchers.js";
import Avatar from "@/components/user/Avatar.vue";

const apiURL = import.meta.env.VITE_APP_API_URL;
const alert = inject('alert');

const emit = defineEmits(['refreshUserPanel', 'closeModal'])

const props = defineProps({
  defaultProp: {
    type: String,
    default: null
  }
});

const form = ref({
  avatar: null,
  filename: null
});



const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'image/png') {
    form.value.avatar = file;
    const userId = sessionStorage.getItem('userId');
    try {
      const response = await saveAvatar(userId, form.value.avatar);
      alert.show('success', response.message)
      emit('refreshUserPanel')
      emit('closeModal')
    } catch (error) {
      alert.show('error', error.detail)
    }
  } else {
    alert.show('error', 'Please upload a PNG file')
  }
};
</script>

<template>
  <section class="change-avatar-container">
    <Avatar
        :active-shift="{}"
        :avatar="props.defaultProp"
        :static="true"
    />

    <div class="change-avatar-input">

      <label for="avatar">Pick avatar:</label>
      <input
          type="file"
          id="avatar"
          @change="handleFileChange"
          accept=".png, .jpg, .jpeg, .gif, .svg"
      />

    </div>


  </section>

</template>

<style scoped>
.change-avatar-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  width: 50%;
  margin: auto;
  background-color: var(--color-background-soft);
  color: #fff;
  text-align: center;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 16px 20px 50px 10px #222222;
}
.change-avatar-input {
  display: grid;
  grid-template-rows: 1fr 1fr;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
