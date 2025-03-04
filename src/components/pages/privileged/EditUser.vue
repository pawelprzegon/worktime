<script setup>

import {usePrivilegedSelectedUser} from "@/stores/privilegedStore.js";
import CorrectionsContainer from "@/components/pages/userPanel/modals/ShiftDetails/corrections/CorrectionsContainer.vue";
import CorrectionForm from "@/components/pages/userPanel/modals/ShiftDetails/corrections/CorrectionForm.vue";

const selectedUser = usePrivilegedSelectedUser();

</script>

<template>

  <div v-if="selectedUser.shift">
    <CorrectionForm :shift-id="selectedUser.shift"/>
  </div>


</template>

<style scoped>

</style>