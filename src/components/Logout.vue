<script setup>

import {logout} from "@/auth.js"

</script>

<template>

  <button
      class="logout-button"
      @click="logout"
  >Logout</button>

</template>

<style scoped>

</style>