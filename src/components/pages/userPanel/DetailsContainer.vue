<script setup>
import { breakEmail } from "@/composables/directives.js";

const props = defineProps({
  label: String,
  data: String,
  background: String,
  color: {
    type: String,
    default: 'none'
  },
  tooltip: {
    type: String,
    required: false
  }
});

</script>

<template>
  <div
    :style="{ background: props.background }"
    class="
      flex flex-row justify-between rounded-sm p-1 mb-1 w-full
      portrait-2xs:text-3xs portrait-2xs:p-[1px] portrait-2xs:m-[1px]
      portrait-xs:text-2xs portrait-xs:p-[2px] portrait-xs:m-[2px]
      portrait-small:text-2xs portrait-small:p-[2px] portrait-small:m-[2px]
      portrait-medium:text-xs
      portrait-large:text-base
      portrait-xl:text-base
    "
  >
    <label :title="props.tooltip">
      {{ props.label }}:
    </label>

    <span v-if="props.data !== ''"
          class="inline-block text-right"
          :class="`text-${props.color}`"
          v-break-email="props.data"
    >
      {{ props.data }}
    </span>
  </div>
</template>