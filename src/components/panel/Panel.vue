<script setup>

import Calendar from "@/components/panel/Calendar.vue";
import {getMe} from "@/fetchers.js";
import {onMounted, ref} from "vue";
import Avatar from "@/components/user/Avatar.vue";
import DetailsContainer from "@/components/panel/DetailsContainer.vue";


const firstName = ref('');
const lastName = ref('');
const email = ref('');
const role = ref('');
const avatar = ref('');
const calculatedTime = ref(0)

const getMeData = async () => {
    try{
      const response =  await getMe()
      console.log(response)
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
  })
</script>


<template>

  <section class="user-section">
    <Calendar
        class="calendar"
        @calculatedTime="handleCalculatedTime"
    />

    <div class="user-details">

      <Avatar
          :active-shift="{}"
          :avatar="avatar"
      />
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

      <DetailsContainer
          :label="'monthly shift time sum'"
          :data="calculatedTime.toString()"
          :background="'#282828'"
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

.user-details {
  grid-area: user-details;
}

.calendar {
  grid-area: calendar;
}

.user-details {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
  width: 200px;
}

.avatar {
  margin: 0;
  padding: 0;
}

@media (max-width: 1000px) {
  .user-section {
    grid-template-columns: 1fr;
    grid-template-areas: "user-details" "calendar";
  }
}

</style>