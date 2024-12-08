<script setup>

import Calendar from "@/pages/userPanel/Calendar.vue";
import {ref} from "vue";
import { useAuthStore } from '@/stores/auth.js';
import {useMonthTime} from "@/stores/overtime.js";
import MonthlyDetails from "@/pages/userPanel/MonthlyDetails.vue";
import UserDetails from "@/pages/userPanel/UserDetails.vue";
import AvatarChanger from "@/pages/userPanel/AvatarChanger.vue";


const authStore = useAuthStore();
const monthTime = useMonthTime();

const isChangeModalActive = ref(false);

const toggleChangeAvatarModal = () => {
  isChangeModalActive.value = !isChangeModalActive.value;
};

const refreshUserPanel = () => {
  authStore.getUserMetadata();
};

console.log(authStore.user)

</script>


<template>

  <section class="user-section">
    <Calendar />

    <div class="dash-details">
      <AvatarChanger
        :avatar="authStore.user.avatar"
        :is-modal-active="isChangeModalActive"
      />
      <UserDetails
        :first-name="authStore.user.firstName"
        :last-name="authStore.user.lastName"
        :email="authStore.user.email"
        :role="authStore.user.role"
        @toggleModal="toggleChangeAvatarModal"
        @refresh="refreshUserPanel"
      />

      <MonthlyDetails
        :worktime-in-seconds="monthTime.worktimeInSeconds"
        :overtime-in-seconds="monthTime.overtimeInSeconds"
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
    align-items: center;
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