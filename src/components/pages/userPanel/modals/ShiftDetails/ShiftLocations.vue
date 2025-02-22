<script setup>
import {usedayStore} from "@/stores/calendarStore.js";
import {onMounted, ref} from "vue";
import {initMap} from "@/composables/location.js";


const dayStore = usedayStore()
const props = defineProps({
  shiftId: {
    type: String,
    required: true,
  }
})

const mapContainer = ref(null);
const map = ref(null);

onMounted(async () => {
  console.log('test')
  const shift = dayStore.getShiftById(props.shiftId)

  const startCoordinates = {
    lat: shift.value.location.start.latitude,
    lng: shift.value.location.start.longitude
  }
  const stopCoordinates = {
    lat: shift.value.location.stop.latitude - 0.001,
    lng: shift.value.location.stop.longitude - 0.001
  }
  map.value = await initMap([startCoordinates, stopCoordinates], mapContainer, map);

});

</script>

<template>
  <div class="flex flex-row justify-center align-middle  h-[200px]">
    <div ref="mapContainer" class="map rounded-xl"></div>
  </div>

</template>

<style scoped>

.map {
  width: 90%;
  height: 90%;
}

</style>