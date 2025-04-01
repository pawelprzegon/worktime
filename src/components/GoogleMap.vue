<script setup>
import {ref, onMounted, watch, reactive, nextTick} from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import Spinner from "@/components/Spinner.vue";
import { useLocationStore } from "@/stores/utilsStore.js";
import { useActiveShift } from "@/stores/shiftStore.js";
import startMarker from '@/assets/img/start-pin.png';
import stopMarker from '@/assets/img/stop-pin.png';
import { useThemeStore } from "@/stores/styleTheme.ts";
import dayMapStyle from "@/assets/maps/dayMapStyle.json";
import nightMapStyle from "@/assets/maps/nightMapStyle.json";
import {googleApi} from "@/composables/utils.js"

const theme = useThemeStore();
const location = useLocationStore();
const activeShift = useActiveShift();

const map = ref(null);
const coordinates = ref([]);
const mapStyle = ref(theme.isDark ? nightMapStyle : dayMapStyle);
const DEFAULT_MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false
};
const mapOptions = reactive({
  ...DEFAULT_MAP_OPTIONS,
  styles: theme.isDark ? nightMapStyle : dayMapStyle
});

const props = defineProps({
  width: {
    type: String,
    default: '[250px]'
  },
  accuracyInfo: {
    type: Boolean,
    default: false
  }
});


onMounted(async () => {

  await nextTick();

  if (!map.value) {

    const checkMapInterval = setInterval(() => {
      if (map.value && map.value.map) {
        clearInterval(checkMapInterval);

        // Ustawiamy opcje mapy
        map.value.map.setOptions({
          ...DEFAULT_MAP_OPTIONS,
          styles: mapOptions.styles
        });
      }
    }, 100);
  } else {
    map.value.map.setOptions({
      ...DEFAULT_MAP_OPTIONS,
      styles: mapOptions.styles
    });
  }

  if (activeShift.shift) {

    const startLocation = activeShift.shift.location?.start;
    const stopLocation = activeShift.shift.location?.stop;

    if (startLocation?.latitude && startLocation?.longitude) {
      coordinates.value.push({ lat: startLocation.latitude, lng: startLocation.longitude });
    }

    if (stopLocation?.latitude && stopLocation?.longitude) {
      coordinates.value.push({ lat: stopLocation.latitude, lng: stopLocation.longitude });
    }
  } else {
    await location.getCurrentLocation();
    coordinates.value.push({ lat: location.latitude, lng: location.longitude });

  }
});


watch(() => theme.isDark, async (newVal) => {
  mapOptions.styles = newVal ? nightMapStyle : dayMapStyle;

  if (map.value) {
    await nextTick();
    map.value.map.setOptions({
      ...DEFAULT_MAP_OPTIONS,
      styles: mapOptions.styles
    });
  }
});


</script>

<template>

  <div
      v-if="coordinates.length > 0"
      class="h-64 w-full shadow-md rounded-xl overflow-hidden"
      :class="[`w-${props.width}`]"
  >
    <GoogleMap
        :api-key=googleApi
        ref="map"
        :center="coordinates[0]"
        :zoom="16"
        style="width: 100%; height: 100%"
        :options="mapOptions"
    >
      <Marker
          v-for="(coord, index) in coordinates"
          :key="index"
          :options="{ position: coord, icon: index === 0 ? startMarker : stopMarker }"
      />
    </GoogleMap>
    <small v-if="location.accuracy > 500 && accuracyInfo"
           class="text-white text-[8px] p-1 shadow-md bg-red-600 absolute left-3 top-3">
      Accuracy: ~{{ location.accuracy.toFixed(0) }}m
    </small>

    <p v-if="location.errorMessage" class="error absolute left-3 top-10">
      {{ location.errorMessage }}
    </p>

  </div>

  <div v-else class="loading-spinner flex flex-col justify-center items-center h-full">
    <Spinner :height="30" :width="30" />
  </div>
</template>

<style scoped>
.error {
  color: red;
}
</style>
