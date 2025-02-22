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
const warning = ref(null);

onMounted(async () => {

  const shift = dayStore.getShiftById(props.shiftId)

  let startCoordinates = null
  let stopCoordinates = null

  if (shift){
    startCoordinates = {
      lat: shift.value.location.start?.latitude ?? null,
      lng: shift.value.location.start?.longitude ?? null
    }
    stopCoordinates = {
      lat: (shift.value.location.stop?.latitude - 0.0001) ?? null,
      lng: (shift.value.location.stop?.longitude - 0.0001) ?? null
    }
  }

  const hasNull = Object.values(startCoordinates).includes(null) ||
                Object.values(stopCoordinates).includes(null);

  if (hasNull) {
      warning.value = "There is some localization data missing";
      return
  }

  map.value = await initMap([startCoordinates, stopCoordinates], mapContainer, map);

});

</script>

<template>
  <div v-if="!warning" class="flex flex-row justify-center align-middle  h-[200px]">
    <div ref="mapContainer" class="map rounded-xl"></div>
  </div>
  <p v-else class="text-red-500 font-bold">
    {{warning}}
  </p>

</template>

<style scoped>

.map {
  width: 90%;
  height: 90%;
}

</style>