<script setup>
import {onMounted, ref} from "vue";
import {initMap} from "@/composables/location.js";


const props = defineProps({
  shift: {
    type: Object,
    required: true,
  }
})

const mapContainer = ref(null);
const map = ref(null);
const warning = ref(null);

onMounted(async () => {

  const coord = []
  let startCoordinates = null
  let stopCoordinates = null

  if (props.shift.location?.start?.latitude) {
    startCoordinates = {
      lat: props.shift.location.start?.latitude ?? null,
      lng: props.shift.location.start?.longitude ?? null
    }
    coord.push(startCoordinates)
  }

  if (props.shift.location?.stop?.latitude) {
    stopCoordinates = {
      lat: (props.shift.location.stop?.latitude - 0.0001) ?? null,
      lng: (props.shift.location.stop?.longitude - 0.0001) ?? null
    }
    coord.push(stopCoordinates)
  }

  map.value = await initMap(coord, mapContainer, map);

});

</script>

<template>
  <div class="my-5

              portrait-2xs:grid-cols-[24px_auto]
              portrait-xs:grid-cols-[28px_auto]
              portrait-small:grid-cols-[32px_auto]
              portrait-medium:grid-cols-[36px_auto]
              portrait-large:grid-cols-[40px_auto]
  "
  >

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