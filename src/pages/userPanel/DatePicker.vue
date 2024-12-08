<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import {ref, watch} from "vue";

const emit = defineEmits(['newDatetime'])
const selectedDate = ref(null);
const datepickerKey = ref(0);

const formatDate = (date) => {
  return date ? date.toISOString().split("T")[0] : "";
};

watch(selectedDate, (newValue, oldValue) => {
  emit('newDatetime', newValue)
});


</script>

<template>
  <div class="minimal-datepicker">
    <VueDatePicker
      ref="datepicker"
      :key="datepickerKey"
      v-model="selectedDate"
      :format="formatDate"
      :hide-header="true"
      :hide-months="true"
      :hide-week-days="true"
      placeholder="Pick"
    />
  </div>
</template>

<style scoped>

.minimal-datepicker .datepicker {
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 5px;
  background: white;
  font-size: 14px;
  width: 300px !important;
}

.minimal-datepicker .dp__header,
.minimal-datepicker .dp__month_year_select,
.minimal-datepicker .dp__weekdays {
  display: none;
}

.minimal-datepicker .dp__cell {
  padding: 8px;
  font-size: 14px;
}
</style>
