<script setup>
import {ref, onMounted, watch, nextTick} from 'vue';
import {initMap} from "@/composables/location.js";
import Spinner from "@/components/Spinner.vue";
import {useLocationStore} from "@/stores/utilsStore.js";
import {useActiveShift} from "@/stores/shiftStore.js";
import startMarker from '@/assets/img/start-pin.png';
import stopMarker from '@/assets/img/stop-pin.png'
import {useThemeStore} from "@/stores/styleTheme.ts";
import dayMapStyle from "@/assets/maps/dayMapStyle.json"
import nightMapStyle from "@/assets/maps/nightMapStyle.json"

const theme = useThemeStore()

const location = useLocationStore()
const activeShift = useActiveShift()

const props = defineProps({
  width: {
    type: String,
    default: '[250px]'
  },
  accuracyInfo: {
    type: Boolean,
    default: false
  }
})

const mapContainer = ref(null);
const mapLoaded = ref(false);
const map = ref(null);
const coordinates = ref ({
    lat: 0,
    lng: 0
  });


onMounted(async () => {
  await nextTick();

  if (activeShift.shift) {
    coordinates.value.lat = activeShift.shift.location.start.latitude
    coordinates.value.lng = activeShift.shift.location.start.longitude
  } else {
    await location.getCurrentLocation();
    coordinates.value.lat = location.latitude
    coordinates.value.lng = location.longitude
  }

  const iconStyle = props.activeShift ? stopMarker : startMarker
  const mapStyle = theme.isDark ? nightMapStyle : dayMapStyle

  if (mapContainer.value) {
    map.value = await initMap([coordinates.value], mapContainer, map, mapStyle, iconStyle);
    mapLoaded.value = true;
  } else {
    console.error("mapContainer is null");
  }
});

watch(() => theme.isDark, async () => {
  const iconStyle = props.activeShift ? stopMarker : startMarker
  const mapStyle = theme.isDark ? nightMapStyle : dayMapStyle
  map.value = await initMap([coordinates.value], mapContainer, map, mapStyle, iconStyle);
})

// watch(
//   () => [location.latitude, location.longitude],
//   async ([lat, lng]) => {
//     if (lat !== null && lng !== null) {
//       const coordinates = {
//         lat: lat,
//         lng: lng
//       }
//       const iconStyle = props.activeShift ? stopMarker : startMarker
//       map.value = await initMap([coordinates], mapContainer, map, iconStyle);
//     }
//   },
//   { immediate: true }
// );

</script>

<template>
  <div
      v-if="location.latitude && location.longitude"
      class="relative h-64 w-full shadow-xl rounded-xl overflow-hidden"
      :class="[
        `w-${props.width}`,
        activeShift.shift ? 'animate-color-change' : ''
      ]"
  >
    <div ref="mapContainer" class="map"></div>
    <div
        class="absolute w-[300px] inset-0 bg-gradient-to-r"
        :class="theme.isDark ? 'from-[#212a37] via-[#212a37]/90 to-transparent' : 'from-white via-white/90 to-transparent'"
    ></div>
    <small v-if="location.accuracy > 500 && accuracyInfo" class="text-white p-1 shadow-md bg-red-600 absolute left-3 top-3"> Your location isn't precise. <br>Accuracy: ~{{location.accuracy.toFixed(0)}}m</small>
    <p v-if="location.errorMessage" class="error absolute left-3 top-10">{{ location.errorMessage }}</p>
    <slot />
    <slot />
  </div>
  <div v-else class="loading-spinner flex flex-col justify-center items-center h-full">
    <Spinner
        :height=30
        :width=30
    />
  </div>


</template>

<style scoped>
.error {
  color: red;
}

.map {
  height: 100%;
}

@keyframes shadowPulse {
    0% {
        box-shadow: 0 0 5px rgba(35, 103, 215, 0.7), 0 0 10px rgba(35, 103, 215, 0.5);
    }
    50% {
        box-shadow: 0 0 10px rgba(35, 103, 215, 1), 0 0 20px rgba(35, 103, 215, 0.8);
    }
    100% {
        box-shadow: 0 0 5px rgba(35, 103, 215, 0.7), 0 0 10px rgba(35, 103, 215, 0.5);
    }
}

.animate-color-change {
    animation: shadowPulse 2s infinite;
}

</style>
