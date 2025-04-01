<script setup>
import {useActiveShift} from "@/stores/shiftStore.js";

const activeShift = useActiveShift();
</script>

<template>

  <div class="flex flex-col place-content-between h-full">

    <div class="h-14 w-full mb-4">
      <h1 class="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        <slot name="title"/>
      </h1>
    </div>

    <div class="grid grid-cols-1 gap-3">

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-auto p-2">
<!--    Map-->
        <div class="relative h-64 bg-white dark:bg-transparent dark:border-2 dark:border-dashed dark:border-neutral-900 rounded-md shadow-md">
            <slot name="map"/>
        </div>
         <div class="h-64 bg-white dark:bg-transparent dark:border-2 dark:border-dashed dark:border-neutral-900 rounded-md shadow-md">
            <slot name="activeShift"/>
         </div>
        <div class="h-64 bg-white dark:bg-transparent dark:border-2 dark:border-dashed dark:border-neutral-900 rounded-md shadow-md">
            <slot name="tasks"/>
        </div>
        <div class="h-64 bg-white dark:bg-transparent dark:border-2 dark:border-dashed dark:border-neutral-900 rounded-md shadow-md">
            <slot name="holidays"/>
        </div>
      </div>

      <div class="h-96 mb-4 bg-white dark:bg-transparent dark:border-2 dark:border-dashed dark:border-neutral-900 rounded-xl shadow-md">

      </div>

      <div>
        Holidays
      </div>

    </div>

<!--    TimeLine-->
    <div
        v-if="activeShift.shift"
        class="h-16 mb-2 p-2 shadow-[0_-2px_6px_-2px] bg-blue-100 dark:bg-neutral-700 dark:shadow-neutral-900 rounded-tl-xl rounded-tr-xl md:mb-0 md:p-4 md:pb-0 md:h-18">
      <slot name="timeline"/>

    </div>
    <p v-else>Coś tutaj trzeba wrzucić kiedy nie będzie aktywnej zmiany</p>
  </div>

</template>

<style scoped>

</style>