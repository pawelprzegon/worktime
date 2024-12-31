<script setup>
import CustomTextButton from "@/components/CustomTextButton.vue";

const props = defineProps({
  label: String,
  data: String,
  background: String,
  color: {
    type: String,
    default: 'none'
  }
});
</script>

<template>
  <div :style="{ background: props.background }"
       class="
       flex flex-row justify-between rounded-sm p-1 m-0 mb-1 w-full
       portrait-xs:text-2xs
       portrait-small::text-xs
       portrait-medium:text-sm
       ">

    <label>{{ props.label }}:</label>
    <span v-if="props.data !== ''"
          class="inline-block break-words"
          :style="{ color: props.color }">
      {{ props.data }}
    </span>
    <CustomTextButton
      v-else
      label="add note"
      :fontSize="12"
    />
  </div>
</template>
