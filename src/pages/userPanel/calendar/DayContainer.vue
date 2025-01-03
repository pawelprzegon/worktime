<script setup>

import {formatTime} from "@/composables/utils.js";
import {useScreenSizeStore} from "@/stores/utilsStore.js";

const screenSize = useScreenSizeStore()

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
        rounded-lg bg-mute shadow-lg border border-third w-24 h-24
        hover:cursor-pointer hover:scale-102

        leading-none m-0 p-0
        below-portrait-2xs:w-full below-portrait-2xs:h-[70px] below-portrait-2xs:p-2 below-portrait-2xs:rounded-md below-portrait-2xs:m-1
        portrait-2xs:w-full portrait-2xs:h-[70px] portrait-2xs:p-2 portrait-2xs:rounded-md portrait-2xs:m-1
        portrait-xs:w-full portrait-xs:h-[80px] portrait-xs:p-2 portrait-xs:rounded-md portrait-xs:m-1

        portrait-small:w-[55px] portrait-small:h-[55px] portrait-small:p-1 portrait-small:rounded-s portrait-small:m-0
        portrait-medium:w-[70px] portrait-medium:h-[70px] portrait-medium:rounded-md portrait-medium:m-0
        portrait-large:w-[80px] portrait-large:h-[80px] portrait-large:rounded-lg portrait-large:m-0
        portrait-xl:w-[90px] portrait-xl:h-[90px] portrait-xl:rounded-lg portrait-xl:m-0
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

          portrait-2xs:text-xs
          portrait-xs:text-xs
          portrait-small:text-2xs
          portrait-medium:text-xs
          portrait-large:text-sm
          portrait-xl:text-base
          "
      >
        {{ props.day.date.getDate()}}
        <span :class="{ hidden: !screenSize.isPortraitXsOr2Xs }">
          {{ props.day.date.toLocaleDateString('pl-PL', { weekday: 'long' }) }}
        </span>
      </span>

      <div
          v-if="props.day.list.length > 0"
          class="h-3/4 w-full
          flex flex-col justify-center place-items-center

          below-portrait-2xs:flex-row below-portrait-2xs:justify-around
          portrait-2xs:flex-row portrait-2xs:justify-around
          portrait-xs:flex-row portrait-xs:justify-around
          portrait-small:flex-col
          portrait-medium:flex-col
          portrait-large:flex-col
          portrait-xl:flex-col
          "
      >

        <small
            v-if="props.day.list.length > 0"
            class="
            text-platinum text-base

            leading-none m-0 p-0

            portrait-2xs:text-sm
            portrait-xs:text-sm
            portrait-small:text-2xs
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

            portrait-2xs:text-sm
            portrait-xs:text-sm
            portrait-small:text-2xs
            portrait-medium:text-sm
            portrait-large:text-base
            portrait-xl:text-lg
            "
        >
          +{{ formatTime(props.day.overtime) }}
        </small>

        <small
            v-if="props.day.list.length > 0 && props.day.toil.duration_seconds >  0"
            class="
            text-turquoise text-base

            leading-none m-0 p-0

            portrait-2xs:text-sm
            portrait-xs:text-sm
            portrait-small:text-xs
            portrait-medium:text-sm
            portrait-large:text-base
            portrait-xl:text-lg
            "
        >
          -{{ formatTime(props.day.toil.duration_seconds) }}
        </small>

      </div>
      <div
          v-else
          class="h-3/4 w-full flex flex-col justify-center items-center"
      >
        <img class="
        filter-invert-30
        group-hover:filter-invert-100

        portrait-2xs:h-[20px] portrait-2xs:w-[20px]
        portrait-xs:h-[20px] portrait-xs:w-[20px]
        portrait-small:h-[20px] portrait-small:w-[20px]
        portrait-medium:h-[25px] portrait-medium:w-[25px]
        portrait-large:h-[30px] portrait-large:w-[30px]
        portrait-xl:h-[35px] portrait-xl:w-[35px]
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