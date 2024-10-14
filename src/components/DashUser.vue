<script setup>
import { useRouter } from 'vue-router'
import {onMounted, defineProps} from "vue";
import {startShift, endShift, getActiveShift} from "@/fetchers.js";


const router = useRouter()
const props = defineProps({
  user: Object,
})

const checkActiveShift = async () => {
  try{
    const active = await getActiveShift(props.user._id)
    props.user.activeShift = active
  } catch (error) {
    console.error("Error fetching getActiveSift:", error);
  }


}

const calculateShift = (shiftStart) => {
  const currentTime = new Date();
  const shiftStartTime = new Date(shiftStart);

  const diff = currentTime - shiftStartTime;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
};

const updateShiftTimes = () => {
  if (props.user.activeShift) {
    props.user.shiftDuration = calculateShift(props.user.activeShift.start);
  }

};

const runShift = async () => {
  const userId = props.user._id
  const note = 'test Note'
  try{
    const endResponse = await startShift(userId, note)
    console.log(endResponse)
    await checkActiveShift()

  } catch (error) {
    console.error("Error fetching runShift:", error);
  }
}

const stopShift = async () => {
  const shiftId = props.user.activeShift._id
  const userId = props.user._id

  try{
    const endResponse = await endShift(shiftId, userId)
    console.log(endResponse)
    props.user.activeShift = null
  } catch (error) {
    console.error("Error fetching stopShift:", error);
  }
}

const loginUser = () => {
  router.push('/user')
}

onMounted(async () => {
  try {
    await checkActiveShift()
    updateShiftTimes()
    setInterval(updateShiftTimes, 1000);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});
</script>

<template>
  <p class="label">{{props.user.first_name}} {{props.user.last_name}}</p>
  <div
      v-if="props.user.activeShift"
      class="status">
    <p class="shift" v-if="props.user.activeShift">{{ props.user.shiftDuration }}</p>
    <button
        class="stop-button"
        @click="stopShift"
    >stop</button>
  </div>

  <div v-else>
    <button
        class="start-button"
        @click="runShift"
    >start</button>
  </div>


</template>

<style scoped>

</style>