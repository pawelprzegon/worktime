<script setup>
import {ref, onMounted, watch, onUnmounted} from 'vue';
import { Loader } from "@googlemaps/js-api-loader";
import mapStyle from "@/assets/mapStyle.json";
import Spinner from "@/components/Spinner.vue";
import {useLocationStore} from "@/stores/utilsStore.js";

const location = useLocationStore()

const errorMessage = ref('');
const mapContainer = ref(null);
const map = ref(null);
let watchId = null;

async function getCurrentLocation() {
  if (!('geolocation' in navigator)) {
    errorMessage.value = 'Geolocation is not supported by this browser.';
    return;
  }

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
      });
    });

    location.setLocation(position)

  } catch (error) {
    switch (error.code || error.message) {
      case 'PERMISSION_DENIED':
        errorMessage.value = 'User denied access to location.';
        break;
    case 'POSITION_UNAVAILABLE':
        errorMessage.value = 'Location information is unavailable.';
        break;
    case 'TIMEOUT':
        errorMessage.value = 'Location request timed out.';
        break;
    case 'UNKNOWN_ERROR':
        errorMessage.value = 'An unknown error occurred while determining the location.';
        break;
    default:
        errorMessage.value = `Error: ${error.message}`;
    }
  }
}

const initMap = async (lat, lng) => {

  const loader = new Loader({
    apiKey: "AIzaSyDNGIcQN-8_fVZnEDk6URTk11PlZTS6dPY",
    version: "weekly",
  });

  await loader.load();

  map.value = new google.maps.Map(mapContainer.value, {
    center: { lat: lat, lng: lng },
    zoom: 18,
    styles: mapStyle,
    disableDefaultUI: true,
    zoomControl: false,
  });

  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map.value,
    title: "Your localization",
    animation: google.maps.Animation.DROP
  });
  console.log("Lat:", lat, "Lng:", lng);
  map.value.setCenter({ lat: lat, lng: lng });
};

onUnmounted(() => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
});

onMounted(async () => {
  await getCurrentLocation();
});

watch(
  () => [location.latitude, location.longitude],
  async ([lat, lng]) => {
    if (lat !== null && lng !== null) {
      await initMap(lat, lng);
    }
  },
  { immediate: true }
);

</script>

<template>
  <div v-if="location.latitude && location.longitude" class="h-[100%]">
    <div ref="mapContainer" class="map rounded-s-xl"></div>
    <small v-if="location.accuracy > 500" class="text-white p-1 bg-red-600 absolute left-1 bottom-1"> Your location isn't precise. <br>Accuracy: ~{{location.accuracy.toFixed(0)}}m</small>
    <p v-if="errorMessage" class="error absolute left-1 top-1">{{ errorMessage }}</p>
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
  width: 100%;
  height: 100%;
}

</style>
