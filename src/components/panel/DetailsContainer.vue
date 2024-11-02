<script setup>

import CustomButton from "@/components/utils/CustomButton.vue";

const props = defineProps({
  label: String,
  data: String,
  background: String
})



</script>

<template>

  <div class="details-container" :style="{background: props.background}">
    <label>{{props.label}}:</label>
    <span
        v-if="props.data !== ''"
        class="wrappable-text"
    >
      {{props.data}}
    </span>
    <CustomButton
        v-else
        :width="50"
        :padding="2"
        :margin="2"
        label="add note"
        :fontSize="12"
    />
  </div>

</template>

<style scoped>

.details-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 5px;
  padding: 1px;
  margin: 0 0 1px 0;
  width: 100%;
}

.wrappable-text {
  display: inline-block;
  word-wrap: break-word;
}

</style>