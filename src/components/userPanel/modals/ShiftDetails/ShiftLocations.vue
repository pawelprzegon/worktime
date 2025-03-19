<script setup>
import {onMounted, ref, watch} from "vue";
import {initMap} from "@/composables/location.js";
import {useThemeStore} from "@/stores/styleTheme.ts";
import dayMapStyle from "@/assets/maps/dayMapStyle.json"
import nightMapStyle from "@/assets/maps/nightMapStyle.json"

const theme = useThemeStore()

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

  const mapStyle = theme.isDark ? nightMapStyle : dayMapStyle
  map.value = await initMap(coord, mapContainer, map, mapStyle);

});



</script>

<template>

  <div v-if="!warning" class="h-[250px] max-w-2xl">
    <div ref="mapContainer" class="map rounded-xl "></div>
  </div>
  <p v-else class="text-red-500 text-xs">
    {{warning}}
  </p>



</template>

<style scoped>

.map {
  height: 100%;
}

</style>