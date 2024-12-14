<script setup>

import {watch, ref} from "vue";
import {usePrivilegedSelectedUser} from "@/stores/privilegedStore.js";
const selectedUser = usePrivilegedSelectedUser()

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

watch(() => props.dataList, () => {

  if (props.dataList.length > 0 && selectedUser.user !== null) {
    console.log(selectedUser.user)
    const matchedUser = props.dataList.find(usr => usr._id === selectedUser.user._id);
    if (matchedUser) {

      selectedUserValue.value = matchedUser;
    }
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