<script setup>

import Calendar from "@/pages/userPanel/Calendar.vue";
import {ref} from "vue";
import { useAuthStore } from '@/stores/auth.js';
import {useMonthTimeStore} from "@/stores/overtime.js";
import MonthlyDetails from "@/pages/userPanel/MonthlyDetails.vue";
import UserDetails from "@/pages/userPanel/UserDetails.vue";


const authStore = useAuthStore();
const monthTimeStore = useMonthTimeStore();

// Modal state
const isChangeModalActive = ref(false);

// Methods
const toggleChangeAvatarModal = () => {
  isChangeModalActive.value = !isChangeModalActive.value;
};

const refreshUserPanel = () => {
  authStore.getUserMetadata();
};

</script>


<template>

  <section class="user-section">
    <Calendar />

    <div class="dash-details">
      <UserDetails
        :avatar="authStore.user.avatar"
        :first-name="authStore.user.firstName"
        :last-name="authStore.user.lastName"
        :email="authStore.user.email"
        :role="authStore.user.role"
        :is-modal-active="isChangeModalActive"
        @toggleModal="toggleChangeAvatarModal"
        @refresh="refreshUserPanel"
      />

      <MonthlyDetails
        :worktime-in-seconds="monthTimeStore.worktimeInSeconds"
        :overtime-in-seconds="monthTimeStore.overtimeInSeconds"
      />
    </div>
  </section>


</template>

<style scoped>

.user-section {
  display: grid;
  grid-template-columns: 75% 25%;
  grid-template-areas: "calendar user-details";
}
.details {
  background: var(--color-background-mute);
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  min-width: 300px;
  max-width: 80%;
  box-shadow: var(--vt-box-shadow);
}

.dash-details {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
}



@media (max-width: 1300px) {
  .user-section {
    grid-template-columns: 100% 1fr;
    grid-template-areas: "user-details" "calendar";
    justify-items: center;
  }

  .dash-details {
    flex-direction: row;
    align-items: end;
  }
}

@media (max-width: 730px) {
  .user-section {
    grid-template-columns: 100% 1fr;
    grid-template-areas: "user-details" "calendar";
    justify-items: center;
  }

  .dash-details {
    flex-direction: column;
    align-items: center;
  }
}

</style>