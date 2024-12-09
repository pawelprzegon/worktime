<script setup>

import {watch, ref} from "vue";
import {useSelectedUser} from "@/stores/privilegedStore.js";
const selectedUser = useSelectedUser()

const props = defineProps({
  label: {
    type: String,
    default: "",
    required: true,
  },
  dataList: {
    type: Array,
    default: () => [],
    required: false
  },
});

const selectedUserValue = ref(null);

function handleSelection() {
  selectedUser.setUser(selectedUserValue.value);
}

watch(() => props.dataList, (newDataList) => {
  if (newDataList.length > 0) {
    selectedUserValue.value = newDataList[0]; // Domyślnie wybierz pierwszy element
  }
}, { immediate: true });

</script>

<template>
  <section class="select-list-container">
    <label class="select-list-label" for="lista">{{label}}</label>
    <select
        class="select-list"
        id="lista"
        name="lista"
        v-model="selectedUserValue"
        @change="handleSelection"

    >
      <option
          v-for="(element, index) in dataList"
          :key="index"
          :value="element"
      >
        {{element.first_name}} {{element.last_name}}
      </option>

    </select>
    <p v-if="selectedUserValue !== null">
      User: {{ selectedUserValue.first_name }} {{ selectedUserValue.last_name }}</p>
  </section>

</template>

<style scoped>
.select-list-container {
  margin: 5px;
}

.select-list-label {
  margin: 5px;
  color:  white;
  font-size: 15px;
}

</style>