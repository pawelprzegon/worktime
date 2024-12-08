<script setup>
import {ref, onMounted} from 'vue'
import Avatar from "@/components/Avatar.vue";
import UserName from "@/components/UserName.vue";
import '@/assets/modal.css';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['closeModal', 'toggleShift'])

const label = ref('')

onMounted(() => {
  label.value = props.user.activeShift ? 'Stop shift?' : 'Start shift?';
})

</script>

<template>

  <div class="modal-overlay" @click="emit('closeModal')">
    <div class="modal-content" @click.stop>

      <div class="shift-toggle-modal">

        <Avatar
            :avatar="props.user.avatar"
            :active-shift="props.user.activeShift"
            :static="true"
        />
        <UserName
            :first-name="props.user.first_name"
            :last-name="props.user.last_name"
        />

        <h2 class="shift-toggle-label">{{label}}</h2>

        <div class="shift-answer">

          <p class="answer-button" @click="emit('toggleShift')">Yes</p>
          <p class="answer-button" @click="emit('closeModal')">No</p>

        </div>

      </div>
    </div>
  </div>

</template>

<style scoped>

.shift-toggle-modal {
  background-color: #222222;
  color: #fff;
  text-align: center;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 16px 20px 50px 10px #222222;
  margin: auto;
}

.shift-answer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px;
  margin-top: 5px;
}

.answer-button {
  width: 20%;
  border: 1px solid gray;
  border-radius: 5px;
  margin: 15px;
  font-size: 20px;
}

.answer-button:hover {
  background: gray;
  color: black;
  cursor: pointer;
}

.shift-toggle-label {
  margin-top: 15px;
}

@media (max-width: 1300px) {
  .shift-toggle-modal {
    min-width: 300px;
    max-width: 400px;
  }
}

</style>