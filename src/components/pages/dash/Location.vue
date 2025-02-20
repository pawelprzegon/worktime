<script setup>
import {ref, onMounted, watch, onUnmounted} from 'vue';
import { Loader } from "@googlemaps/js-api-loader";
import mapStyle from "@/assets/mapStyle.json";

const latitude = ref(null);
const longitude = ref(null);
const accuracy = ref(null);
const errorMessage = ref('');
const mapContainer = ref(null);
const map = ref(null);

async function getCurrentLocation() {
  if (!('geolocation' in navigator)) {
    errorMessage.value = 'Geolokalizacja nie jest wspierana przez tę przeglądarkę.';
    return;
  }

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
        frequency: 3000
      });
    });

    latitude.value = position.coords.latitude;
    longitude.value = position.coords.longitude;
    accuracy.value = position.coords.accuracy;

    console.log('Szczegóły pozycji:', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp
    });
  } catch (error) {
    switch (error.code || error.message) {
      case 'PERMISSION_DENIED':
        errorMessage.value = 'Użytkownik odmówił dostępu do lokalizacji.';
        break;
      case 'POSITION_UNAVAILABLE':
        errorMessage.value = 'Informacje o lokalizacji są niedostępne.';
        break;
      case 'TIMEOUT':
        errorMessage.value = 'Przekroczono czas oczekiwania na określenie lokalizacji.';
        break;
      case 'UNKNOWN_ERROR':
        errorMessage.value = 'Wystąpił nieznany błąd podczas określania lokalizacji.';
        break;
      default:
        errorMessage.value = `Błąd: ${error.message}`;
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

  map.value.setCenter({ lat: lat, lng: lng });
};

let watchId = null;
function startWatchingPosition() {
  if (!('geolocation' in navigator)) return;

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      latitude.value = position.coords.latitude;
      longitude.value = position.coords.longitude;
      accuracy.value = position.coords.accuracy;

      if (map.value) {
        map.value.setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }
    },
    (error) => {
      console.error('Błąd podczas monitorowania pozycji:', error);
      errorMessage.value = 'Wystąpił błąd podczas śledzenia lokalizacji.';
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
      distanceFilter: 10
    }
  );
}

onUnmounted(() => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
});

onMounted(async () => {
  await getCurrentLocation();
});

watch([latitude, longitude], async ([lat, lng]) => {
  if (lat !== null && lng !== null) {
    await initMap(lat, lng);
    startWatchingPosition();
  }
});
</script>

<template>
  <div v-if="latitude && longitude" class="h-[100%]">
    <div ref="mapContainer" class="map rounded-s-xl"></div>
    <small v-if="accuracy > 500" class="text-white p-1 bg-red-600 absolute left-2 bottom-2"> Your location isn't precise </small>
  </div>
  <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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
