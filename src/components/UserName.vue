<script setup>

const props = defineProps({
  firstName: String,
  lastName: String
})

</script>

<template>
  <section class="flex flex-col justify-center items-center gap-0 my-3 portrait-medium:my-2 portrait-xs:my-1">
    <small
      class="text-[15px] leading-[1.5] sm:text-[13px] md:text-[12px] lg:text-[11px] xl:text-[10px]
      portrait-medium:text-sm portrait-xs:text-xs"
    >
      {{ props.firstName }}
    </small>
    <small
      class="text-[15px] leading-[1.5] sm:text-[13px] md:text-[12px] lg:text-[11px] xl:text-[10px]
      portrait-medium:text-sm portrait-xs:text-xs"
    >
      {{ props.lastName }}
    </small>
  </section>
</template>

<style scoped>

</style>