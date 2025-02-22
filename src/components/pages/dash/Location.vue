<script setup>
import {ref, onMounted, watch} from 'vue';
import {initMap} from "@/composables/location.js";
import Spinner from "@/components/Spinner.vue";
import {useLocationStore} from "@/stores/utilsStore.js";
import startMarker from '@/assets/img/start-pin.png';
import stopMarker from '@/assets/img/stop-pin.png'

const location = useLocationStore()

const props = defineProps({
  activeShift: {
    type: Object,
    default: {}
  }
})

const mapContainer = ref(null);
const map = ref(null);


onMounted(async () => {
  await location.getCurrentLocation();
});

watch(
  () => [location.latitude, location.longitude],
  async ([lat, lng]) => {
    if (lat !== null && lng !== null) {
      const coordinates = {
        lat: lat,
        lng: lng
      }
      const iconStyle = props.activeShift ? stopMarker : startMarker
      map.value = await initMap([coordinates], mapContainer, map, iconStyle);
    }
  },
  { immediate: true }
);

</script>

<template>
  <div v-if="location.latitude && location.longitude" class="h-[100%]">
    <div ref="mapContainer" class="map rounded-s-xl"></div>
    <small v-if="location.accuracy > 500" class="text-white p-1 bg-red-600 absolute left-1 bottom-1"> Your location isn't precise. <br>Accuracy: ~{{location.accuracy.toFixed(0)}}m</small>
    <p v-if="location.errorMessage" class="error absolute left-1 top-1">{{ location.errorMessage }}</p>
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
