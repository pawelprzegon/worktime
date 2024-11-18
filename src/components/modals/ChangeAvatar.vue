<script setup>
import {inject, ref} from 'vue'
import { saveAvatar } from "@/fetchers.js";
import Avatar from "@/components/user/Avatar.vue";
import '@/assets/modal.css';

const alert = inject('alert');

const emit = defineEmits(['refreshUserPanel', 'closeModal'])

const props = defineProps({
  avatar: {
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
  if (file) {
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
    alert.show('warning', 'None file attached')
  }
};

const closeModal = () => {
  emit('closeModal')
}

</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <section class="change-avatar-container">
        <Avatar
            :active-shift="{}"
            :avatar="props.avatar"
            :static="true"
        />

        <div class="change-avatar-input">

          <label for="avatar" class="custom-file-label">Pick avatar:</label>
          <input
              type="file"
              id="avatar"
              @change="handleFileChange"
              accept=".png, .jpg, .jpeg, .gif, .svg"
              style="display: none;"
          />

        </div>


      </section>
    </div>
  </div>

</template>

<style scoped>
.change-avatar-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  width: 450px;
  margin: auto;
  background-color: var(--color-background-soft);
  color: #fff;
  text-align: center;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 16px 20px 50px 10px #222222;
}

.custom-file-label {
    display: inline-block;
    padding: 10px 20px;
    background-color: var(--color-background);
    color: white;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
}
.custom-file-label:hover {
    background-color: white;
  color: black
}

.change-avatar-input {
  display: block;
  margin: auto;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

@media (max-width: 1300px) {
  .change-avatar-container {
    width: 400px;
  }
}

@media (max-width: 1300px) {
  .change-avatar-container {
    width: 300px;
  }

}

</style>
