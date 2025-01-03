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
import CustomTextButton from "@/components/CustomTextButton.vue";
import {setOVHistory} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";

const alert = useAlertStore()
const authStore = useAuthStore();
const monthStore = ref(useSelectedMonthStore('calendar'))

const isChangeModalActive = ref(false);
const refreshUserPanel = () => {
  authStore.getUserMetadata();
};

const closeMonth = async () => {
  const userId = authStore.user.id
  const month = monthStore.value.selected.month.getMonth() + 1
  const year = monthStore.value.selected.month.getFullYear()

  const response = await setOVHistory(userId, year, month)

  alert.show(response.status, response.message)

}

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
          :color="monthStore.selected.monthlyRegularTime ? 'platinum' : 'secondary'"
          tooltip="Work time"
        />

        <DetailsContainer
          :label="'overtime'"
          :data="formatTime(monthStore.selected.monthlyOvertime).toString()"
          :background="'#282828'"
          :color="monthStore.selected.monthlyOvertime ? 'overtime' : 'secondary'"
          tooltip="All overtimes collected from preview months"
        />

        <DetailsContainer
          :label="'toils'"
          :data="formatTime(monthStore.selected.toils).toString()"
          :background="'#282828'"
          :color="monthStore.selected.toils ? 'turquoise' : 'secondary'"
          tooltip="Time Off In Lieu"
        />

        <CustomTextButton
            label="Close Month"
            @click="closeMonth"
            :is-closed="monthStore.selected.closed"
        />

      </ShadowBox>

    </div>
  </section>


</template>

<style scoped>

</style>