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

        <DetailsContainer
            :label="'monthly work time'"
            :data="calculatedTime.toString()"
            :background="'#282828'"
        />

      </section>


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
  background: rgb(40, 40, 40);
  padding: 1rem;
  border-radius: 10px;
  min-width: 250px;
  max-width: 80%;
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
  width: 100%
}

.avatar {
  margin: 0;
  padding: 0;
}

@media (max-width: 1300px) {
  .user-section {
    grid-template-columns: 1fr;
    grid-template-areas: "user-details" "calendar";
  }

  .details {
    min-width: 250px;
    max-width: 40%;
  }
}

</style>