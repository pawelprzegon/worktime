<script setup>

import {ref} from "vue";
import { useAuthStore } from '@/stores/authStore.js';
import Calendar from "@/pages/userPanel/calendar/Calendar.vue";
import {useCalendarMonthTime} from "@/stores/utilsStore.js";
import AvatarChanger from "@/pages/userPanel/AvatarChanger.vue";
import Alert from "@/components/Alert.vue";
import {formatTime} from "@/composables/utils.js";
import ShadowBox from "@/components/ShadowBox.vue";
import DetailsContainer from "@/pages/userPanel/DetailsContainer.vue";


const authStore = useAuthStore();
const monthTime = useCalendarMonthTime('calendarMonthTime');

const isChangeModalActive = ref(false);

const refreshUserPanel = () => {
  authStore.getUserMetadata();
};

</script>


<template>
  <Alert/>
  <section class="user-section">
    <Calendar />

    <div class="dash-details">
      <AvatarChanger
        :avatar="authStore.user.avatar"
        :is-modal-active="isChangeModalActive"
        @refresh="refreshUserPanel"
      />
      <ShadowBox>
        <DetailsContainer :label="'firstname'" :data="authStore.user.firstName" :background="'#282828'" :color="'#CCCCCCFF'"/>
        <DetailsContainer :label="'lastname'" :data="authStore.user.lastName" :background="'#282828'" :color="'#CCCCCCFF'"/>
        <DetailsContainer :label="'email'" :data="authStore.user.email" :background="'#282828'" :color="'#CCCCCCFF'"/>
        <DetailsContainer :label="'role'" :data="authStore.user.role" :background="'#282828'" :color="'#CCCCCCFF'"/>
      </ShadowBox>

      <ShadowBox>
        <DetailsContainer
          :label="'regular'"
          :data="formatTime(monthTime.worktimeInSeconds).toString()"
          :background="'#282828'"
          :color="'#CCCCCCFF'"
        />
        <DetailsContainer
          :label="'overtime'"
          :data="formatTime(monthTime.overtimeInSeconds).toString()"
          :background="'#282828'"
          color="var(--color-text-overtime)"
        />
      </ShadowBox>

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