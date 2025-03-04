<script setup>

import '@/assets/modal.css'
import CorrectionForm from "@/components/pages/userPanel/modals/ShiftDetails/corrections/CorrectionForm.vue";
import CorrectionHistory from "@/components/pages/userPanel/modals/ShiftDetails/corrections/CorrectionHistory.vue";

const props = defineProps({
  shiftId: {
    type: String,
    required: true,
  }
})


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
        src="../../../../../../assets/img/exchange.png"
        alt="location"
        class="filter-invert-100
              portrait-2xs:w-[16px]
              portrait-xs:w-[20px]
              portrait-small:w-[24px]
              portrait-medium:w-[28px]
              portrait-large:w-[32px]
              "

    />
    <div
      class="
      grid grid-cols-[40%_auto]

      portrait-2xs:grid-rows-2 portrait-2xs:grid-cols-none
      portrait-medium:grid-rows-none portrait-medium:grid-cols-[40%_auto]
      "
    >
      <CorrectionHistory :shift-id="props.shiftId"/>

      <CorrectionForm :shift-id="props.shiftId"/>

    </div>
  </div>

</template>

<style scoped>


.corrections-table {
  border-collapse: collapse;
}

.corrections-table thead,
.corrections-table tbody{
  font-size: 10px;
}

.corrections-table th,
.corrections-table td {
  border: 1px solid #ccc;
}

</style>