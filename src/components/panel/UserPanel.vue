<script setup>

import Calendar from "@/components/panel/Calendar.vue";
import {getMe} from "@/fetchers.js";
import {onMounted, ref} from "vue";
import Avatar from "@/components/user/Avatar.vue";
import DetailsContainer from "@/components/panel/DetailsContainer.vue";
import Spinner from "@/components/panel/Spinner.vue";

const isLoading = ref(true);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const role = ref('');
const avatar = ref('');
const calculatedTime = ref(0)

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
    }
  }

  const handleCalculatedTime = (cT) => {
    calculatedTime.value = cT
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

        <Avatar
            :active-shift="{}"
            :avatar="avatar"
        />

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
            :label="'monthly work time'"
            :data="calculatedTime.toString()"
            :background="'#282828'"
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

.avatar {
  margin: 0;
  padding: 0;
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
  }

  .dash-details,
  .user-details {
    flex-direction: column;
    align-items: center;
  }
}

</style>