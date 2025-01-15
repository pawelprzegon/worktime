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

const handleSelection = () => {
  selectedUser.setUser(selectedUserValue.value);
}

watch(() => props.dataList, () => {

  if (props.dataList.length > 0 && selectedUser.user !== null) {
    const matchedUser = props.dataList.find(usr => usr.id === selectedUser.user.id);
    if (matchedUser) {

      selectedUserValue.value = matchedUser;
    }
  }
}, { immediate: true });

</script>

<template>
  <div class="m-1 w-8/12">
    <label class="text-base text-white m-1" for="lista">{{label}}</label>
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

    <p v-if="!selectedUser.user" class="text-gray-500">No user selected. Please choose a user to view the schedule.</p>
  </div>

</template>

<style scoped>

</style>