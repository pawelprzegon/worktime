<script setup>

import {ref} from "vue";
import { useAuthStore } from '@/stores/authStore.js';
import Calendar from "@/pages/userPanel/calendar/Calendar.vue";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import AvatarChanger from "@/pages/userPanel/AvatarChanger.vue";
import Alert from "@/components/Alert.vue";
import {formatTime} from "@/composables/utils.js";
import ShadowBox from "@/components/ShadowBox.vue";
import DetailsContainer from "@/pages/userPanel/DetailsContainer.vue";


const authStore = useAuthStore();
const monthStore = useSelectedMonthStore('calendar');

const isChangeModalActive = ref(false);

const refreshUserPanel = () => {
  authStore.getUserMetadata();
};

</script>


<template>
  <Alert/>
  <section
    class="
    grid justify-items-center
    grid-areas-grid-column
    portrait-large:grid-areas-grid-row
    w-full
    "
>
  <div class="grid-in-area-calendar">
    <Calendar />
  </div>

  <div
      class="
        grid-in-area-user
        grid justify-items-center items-end

        portrait-2xs:block
        portrait-xs:block
        portrait-small:[grid-template-columns:auto_auto_auto] portrait-small:grid
        portrait-medium:[grid-template-columns:auto_auto_auto]
        portrait-large:block
        portrait-xl:block
        portrait-2xl:block
      ">
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
          :data="formatTime(monthStore.selected.monthlyRegularTime).toString()"
          :background="'#282828'"
          :color="'#CCCCCCFF'"
        />

        <DetailsContainer
          :label="'prev. month overtime'"
          :data="formatTime(monthStore.selected.lastMonthOvertime).toString()"
          :background="'#282828'"
          color="var(--color-text-overtime)"
        />

        <DetailsContainer
          :label="'overtime'"
          :data="formatTime(monthStore.selected.monthlyOvertime).toString()"
          :background="'#282828'"
          color="var(--color-text-overtime)"
        />
      </ShadowBox>

    </div>
  </section>


</template>

<style scoped>

</style>