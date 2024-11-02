<script setup>

const props = defineProps({
  label: String,
  note: String,
})



</script>

<template>

  <div class="shift-note">
    <label style="border-bottom: 1px solid #696969">{{props.label}}:</label>
    <span>
      {{props.note}}
    </span>

  </div>

</template>

<style scoped>

.shift-note {
  display: flex;
  flex-direction: column;
  padding: 0 15px;
}

</style>