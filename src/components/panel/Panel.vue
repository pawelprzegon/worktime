<script setup>

import Calendar from "@/components/panel/Calendar.vue";
import {getMe} from "@/fetchers.js";
import {onMounted, ref} from "vue";
import Avatar from "@/components/user/Avatar.vue";


const firstName = ref('');
const lastName = ref('');
const email = ref('');
const userName = ref('');
const role = ref('');
const avatar = ref('');

const getMeData = async () => {
    try{
      const response =  await getMe()
      console.log(response)
      firstName.value = response.first_name
      lastName.value = response.last_name
      email.value = response.email
      userName.value = `${response.first_name} ${response.last_name}`
      role.value = response.role
      avatar.value = response.avatar

    } catch (error) {
      console.log(error)
    }
  }

  onMounted(() => {
    getMeData();
  })
</script>


<template>

  <section class="user-section">
    <Calendar />

    <div class="user-details">

      <Avatar
          :active-shift="{}"
          :avatar="avatar"
      />
      <p>{{userName}}</p>
      <p>{{email}}</p>
      <p>{{role}}</p >
    </div>



  </section>


</template>

<style scoped>

.user-section {
  display: grid;
  grid-template-columns: 75% 25%;
}

.user-details {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 10px;
  padding: 5px;
}

.avatar {
  margin: 0;
  padding: 0;
}

</style>