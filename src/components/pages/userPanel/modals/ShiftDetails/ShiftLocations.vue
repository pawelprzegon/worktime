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
  <div class="grid grid-cols-[40px_auto] my-5

              portrait-2xs:grid-cols-[24px_auto]
              portrait-xs:grid-cols-[28px_auto]
              portrait-small:grid-cols-[32px_auto]
              portrait-medium:grid-cols-[36px_auto]
              portrait-large:grid-cols-[40px_auto]
  "
  >

    <img
        src="@/assets/img/location.png"
        alt="location"
        class="filter-invert-100
              portrait-2xs:w-[16px]
              portrait-xs:w-[20px]
              portrait-small:w-[24px]
              portrait-medium:w-[28px]
              portrait-large:w-[32px]
              "

    />
    <div class="my-auto">

      <div v-if="!warning" class="flex flex-row justify-center align-middle h-[200px]">
        <div ref="mapContainer" class="map rounded-xl"></div>
      </div>
      <p v-else class="text-red-500 text-xs">
        {{warning}}
      </p>
    </div>

  </div>


</template>

<style scoped>

.map {
  width: 90%;
  height: 90%;
}

</style>