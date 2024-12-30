<script setup>

import {formatTime} from "@/composables/utils.js";

const props = defineProps({
  day: Object,
  toilTaken: Number,
  regular: Number,
  overtime: Number
})
</script>

<template>
    <div
        class="
        group
        rounded-lg bg-mute p-2 shadow-lg border border-third w-24 h-24
        hover:cursor-pointer hover:scale-102
        m-auto
        portrait-xs:w-14 portrait-xs:h-14 portrait-xs:p-1
        portrait-small:w-16 portrait-small:h-16 portrait-small:p-1
        portrait-medium:w-20 portrait-medium:h-20
        portrait-large:w-24 portrait-large:h-24
        portrait-xl:w-24 portrait-xl:h-24
        "
      :class="[
          {
            'unfinished-shift': props.day.list.length > 0,
            'finished-shift': (props.day.regular + (props.day.overtime || 0) * 3600) >= 28800
          }]"
    >
      <span
          class="
          h-1/4 w-full border-b border-silver inline-block

          portrait-xs:text-2xs
          portrait-small:text-xs
          portrait-medium:text-xs
          portrait-large:text-sm
          portrait-xl:text-base
          "
      >
        {{ props.day.date.getDate() }}
      </span>

      <div
          v-if="props.day.list.length > 0"
          class="h-3/4 w-full flex flex-col justify-center place-items-center"
      >

        <small
            v-if="props.day.list.length > 0"
            class="
            text-platinum text-base

            leading-none m-0 p-0
            portrait-xs:text-2xs
            portrait-small:text-xs
            portrait-medium:text-sm
            portrait-large:text-base
            portrait-xl:text-lg
            "
        >
          {{ formatTime(props.day.regular) }}
        </small>

        <small
            v-if="props.day.list.length > 0 && props.day.overtime"
            class="
            text-overtime text-base

            leading-none m-0 p-0
            portrait-xs:text-2xs
            portrait-small:text-xs
            portrait-medium:text-sm
            portrait-large:text-base
            portrait-xl:text-lg
            "
        >
          +{{ formatTime(props.day.overtime) }}
        </small>

        <small
            v-if="props.day.list.length > 0 && props.day.toilTaken"
            class="
            text-turquoise text-base

            portrait-xs:text-2xs
            portrait-small:text-xs
            portrait-medium:text-sm
            portrait-large:text-base
            portrait-xl:text-lg
            "
        >
          -{{ formatTime(props.day.toilTaken.hours * 3600) }}
        </small>

      </div>
      <div
          v-else
          class="h-3/4 w-full flex flex-col justify-center items-center"
      >
        <img class="
        filter-invert-30
        group-hover:filter-invert-100
        "
             src="@/assets/img/add.png" alt="add-shift">
      </div>
    </div>
</template>

<style scoped>

.unfinished-shift {
  background: var(--vt-c-indigo);
}

.finished-shift {
  background: var(--finished-color);
}

.started-shift {
  background: var(--idle-color);
}

</style>