<script setup>

import {getTime} from "@/composables/utils.js";
import ShiftDetailContainer from "@/components/pages/userPanel/ShiftDetailContainer.vue";
import {useDayStore} from "@/stores/calendarStore.js";

const dayStore = useDayStore();

const props = defineProps({
  shiftId: {
    type: String,
    required: true,
  }
})

const shift = dayStore.getShiftById(props.shiftId)

</script>

<template>

  <div v-if="shift?.update.length > 0" class="grid grid-flow-row">

    <div class="grid

    portrait-2xs:grid-cols-[30%_20%_20%]
    portrait-medium:grid-cols-[60px_auto_auto]
    ">

       <p class="text-sm m-auto">default</p>

       <ShiftDetailContainer
          :time="getTime(shift.start)"
          :text="Object({color: 'emerald-500', weight: ''})"
          :justify="'center'"
        />

        <ShiftDetailContainer
          :time="getTime(shift.stop)"
          :text="Object({color: 'red-500', weight: ''})"
          :justify="'center'"
        />

    </div>

    <div v-for="(correction, index) in shift.update" :key="index"
         class="grid

         portrait-2xs:grid-cols-[30%_20%_20%]
         portrait-medium:grid-cols-[60px_auto_auto]
         "
    >

      <p class="text-sm m-auto">{{index + 1}}</p>

       <ShiftDetailContainer
          :time="getTime(correction.start)"
          :text="Object({color: 'emerald-500', weight: ''})"
          :justify="'center'"
        />

        <ShiftDetailContainer
          :time="getTime(correction.stop)"
          :text="Object({color: 'red-500', weight: ''})"
          :justify="'center'"
        />

    </div>

  </div>
  <div v-else></div>

</template>

<style scoped>

</style>