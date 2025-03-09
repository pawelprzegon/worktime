<script setup>

import {ref} from "vue";
import { useAuthStore } from '@/stores/authStore.js';
import Calendar from "@/components/userPanel/calendar/Calendar.vue";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import AvatarChanger from "@/components/userPanel/AvatarChanger.vue";
import Alert from "@/components/Alert.vue";
import {formatTime} from "@/composables/utils.js";
import ShadowBox from "@/components/ShadowBox.vue";
import DetailsContainer from "@/components/userPanel/DetailsContainer.vue";
import CustomTextButton from "@/components/CustomTextButton.vue";
import {setOVHistory} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";
import ModalWrapper from "@/components/ModalWrapper.vue";
import {format} from "date-fns";
import Banner from "@/components/Banner.vue";

const alert = useAlertStore()
const authStore = useAuthStore();
const monthStore = ref(useSelectedMonthStore('calendar'))

const isChangeModalActive = ref(false);
const isCloseMonthModal = ref(false);

const refreshUserPanel = () => {
  authStore.getUserMetadata();
};

const openCloseMonthModal = () => {
  isCloseMonthModal.value = true;
}

const closeCloseMonthModal = () => {
  isCloseMonthModal.value = false;
}

const closeMonth = async () => {
  const userId = authStore.user.id
  const month = monthStore.value.selected.month.getMonth() + 1
  const year = monthStore.value.selected.month.getFullYear()

  try{
    const response = await setOVHistory(userId, year, month)
    alert.show(response.status, response.message)
    monthStore.value.refresh()
  } catch (error) {
    alert.show("error", error.message)
  } finally {
    closeCloseMonthModal()
  }
}


</script>


<template>
  <Alert/>
  <Banner
      v-if='authStore.user.disabled'
      :main-text="'Account deactivated'"
      :additional-text="'Edit functions disabled'"
      :supplementary-text="': contact your administrator'"
  />
  <section
    class="
    grid justify-items-center
    grid-areas-grid-column
    grid-rows-[auto_1fr]
    grid-cols-none
    portrait-large:grid-areas-grid-row
    portrait-large:grid-cols-[2fr_1fr]
    portrait-large:grid-rows-none
    w-full h-full
    "
  >

    <Calendar />

    <div
        class="
          grid-in-area-user
          grid justify-items-center items-center

          portrait-2xs:block
          portrait-xs:block
          portrait-small:[grid-template-columns:auto_auto_auto] portrait-small:grid
          portrait-medium:[grid-template-columns:auto_auto_auto]
          portrait-large:block
          portrait-xl:block
          portrait-2xl:block
        "
    >
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
              @click="openCloseMonthModal"
              :is-closed="monthStore.selected.closed"
          />

        </ShadowBox>

      <ModalWrapper
          v-show="isCloseMonthModal"
          :close-modal="closeCloseMonthModal">

        <ShadowBox>
          <div class="p-3">

            <h1 class="text-platinum text-base m-3">Close {{format(monthStore.selected.month, 'MMMM yyyy')}} month</h1>
            <p class="text-red-300">After confirming, you will no longer be able to edit any shifts from this month.</p>
            <p>Additionally, any unused overtime from this month will be carried over to the next month.</p>

            <div class="m-3">
              <div class="m-4">
                <CustomTextButton label="Yes" @click="closeMonth"/>
              </div>
              <div class="m-4">
                <CustomTextButton label="No" @click="closeCloseMonthModal"/>
              </div>
            </div>

          </div>

        </ShadowBox>
      </ModalWrapper>

      </div>
  </section>


</template>

<style scoped>

</style>