<script setup>

</script>

<template>

  <div class="flex flex-col place-content-between h-full">

    <div class="h-14 w-full mb-4">
      <h1 class="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        <slot name="title"/>
      </h1>
    </div>

    <div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
<!--    Map-->
        <div class="h-64 mb-4">
            <slot name="left"/>
            <slot name="right"/>
         </div>
      </div>

      <div class="h-96 mb-4 bg-white dark:bg-transparent dark:border-2 dark:border-dashed dark:border-neutral-900 rounded-xl">

      </div>

      <div>
        Holidays
      </div>

    </div>

<!--    TimeLine-->
    <div class="h-16 mb-2 p-2 bg-white dark:bg-pre-primary rounded-tl-xl rounded-tr-xl md:mb-0 md:p-4 md:pb-0 md:h-18">
      <slot name="timeline"/>
    </div>

  </div>

</template>

<style scoped>

</style>