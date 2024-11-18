<script setup>

import Calendar from "@/components/panel/Calendar.vue";
import {getMe} from "@/fetchers.js";
import {onMounted, ref, inject} from "vue";
import Avatar from "@/components/user/Avatar.vue";
import DetailsContainer from "@/components/panel/DetailsContainer.vue";
import Spinner from "@/components/panel/Spinner.vue";
import ChangeAvatar from "@/components/modals/ChangeAvatar.vue";

const alert = inject('alert');

const isLoading = ref(true);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const role = ref('');
const avatar = ref('');
const calculatedWorkTime = ref(0)
const calculatedOvertimeTime = ref(0)
const isChangeModalActive = ref(false)

const getMeData = async () => {
    try{
      const response =  await getMe()
      firstName.value = response.first_name
      lastName.value = response.last_name
      email.value = response.email
      role.value = response.role
      avatar.value = response.avatar

    } catch (error) {
      console.log(error)
      alert.show('error', error)
    }
  }

  const handleCalculatedTime = (cT) => {
    calculatedWorkTime.value = cT.work
    calculatedOvertimeTime.value = cT.overtime
  }

  const changeAvatarModalToggle = () => {
    isChangeModalActive.value = !isChangeModalActive.value
  }

  const refreshUserPanel = () => {
    getMeData();
  }

  onMounted(() => {
    getMeData();
    isLoading.value = false;
  })
</script>


<template>

  <div v-if="isLoading" class="loading-spinner">
    <Spinner />
  </div>

  <section v-else class="user-section">
    <Calendar @calculatedTime="handleCalculatedTime"/>
    <div class="dash-details">

      <div class="user-details">

        <section class="avatar-container">

          <Avatar
              :active-shift="{}"
              :avatar="avatar"
              :static="true"
          />

          <img
            class="avatar-overlay"
            src="@/assets/img/refresh.png"
            alt="overlay"
            @click="changeAvatarModalToggle"
          />

          <ChangeAvatar
              v-if="isChangeModalActive"
              :avatar="avatar"
              @closeModal="changeAvatarModalToggle"
              @refreshUserPanel="refreshUserPanel"
          />

        </section>

        <section class="details">

          <DetailsContainer
              :label="'firstname'"
              :data="firstName"
              :background="'#282828'"
          />

          <DetailsContainer
              :label="'lastname'"
              :data="lastName"
              :background="'#282828'"
          />

          <DetailsContainer
              :label="'email'"
              :data="email"
              :background="'#282828'"
          />

          <DetailsContainer
              :label="'role'"
              :data="role"
              :background="'#282828'"
          />

        </section>
      </div>
      <div class="shifts-details">
        <section class="details">
          <DetailsContainer
            :label="'regular'"
            :data="calculatedWorkTime.toString()"
            :background="'#282828'"
          />
          <DetailsContainer
            :label="'overtime'"
            :data="calculatedOvertimeTime.toString()"
            :background="'#282828'"
            color="var(--color-text-overtime)"
          />
        </section>
      </div>

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

.dash-details,
.user-details,
.shifts-details {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
}

.avatar-container {
  position: relative;
}

.avatar-overlay {
  position: absolute;
  filter: invert(50%);
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
}

.avatar-overlay:hover {
  filter: invert(100%);
  animation: rotateAnimation 2s linear infinite;
  cursor: pointer;
}

@keyframes rotateAnimation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 1300px) {
  .user-section {
    grid-template-columns: 100% 1fr;
    grid-template-areas: "user-details" "calendar";
    justify-items: center;
  }

  .details {
    min-width: 250px;
    max-width: 40%;
    margin: 0;
  }

  .dash-details,
  .user-details {
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

  .details {
    min-width: 250px;
    max-width: 40%;
    margin: 0;
  }

  .dash-details,
  .user-details {
    flex-direction: column;
    align-items: center;
  }
}

</style>