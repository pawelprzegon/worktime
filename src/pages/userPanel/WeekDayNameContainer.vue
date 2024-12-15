<script setup>

defineProps({
  day: String
})
</script>

<template>

  <small class="weekday-name">
    {{day}}
  </small>

</template>

<style scoped>
.weekday-name {
  text-align: center;
}
</style>