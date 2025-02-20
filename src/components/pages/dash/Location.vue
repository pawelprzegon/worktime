<script setup>
import {ref, onMounted, watch} from 'vue';
import { Loader } from "@googlemaps/js-api-loader";
import mapStyle from "@/assets/mapStyle.json";

const latitude = ref(null);
const longitude = ref(null);
const errorMessage = ref('');

const mapContainer = ref(null);
const map = ref(null);

onMounted( () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage.value = 'Użytkownik odmówił dostępu do lokalizacji.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage.value = 'Informacje o lokalizacji są niedostępne.';
            break;
          case error.TIMEOUT:
            errorMessage.value = 'Żądanie lokalizacji wygasło.';
            break;
          default:
            errorMessage.value = 'Wystąpił nieznany błąd.';
        }
      },
        { enableHighAccuracy: true, timeout: 2000, maximumAge: 0 }
    );
  } else {
    errorMessage.value = 'Geolokalizacja nie jest wspierana przez tę przeglądarkę.';
  }
});

watch([latitude, longitude], async ([lat, lng]) => {
  if (lat !== null && lng !== null) {
    await initMap(lat, lng);
  }
});

const initMap = async (lat, lng) => {
  const loader = new Loader({
    apiKey: "AIzaSyDNGIcQN-8_fVZnEDk6URTk11PlZTS6dPY",
    version: "weekly",
  });

  await loader.load();
  map.value = new google.maps.Map(mapContainer.value, {
    center: {lat: lat, lng: lng},
    zoom: 16,
    styles: mapStyle,
    disableDefaultUI: true,
  });

  new google.maps.Marker({
    position: {lat: lat, lng: lng},
    map: map.value,
    title: "",
  });
}
</script>

<template>
  <div v-if="latitude && longitude" class="h-[100%]">
    <div ref="mapContainer" class="map rounded-s-xl"></div>
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
