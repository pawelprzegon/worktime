
<script setup>
  import DetailsContainer from "@/pages/userPanel/DetailsContainer.vue";
  import { formatTime } from "@/composables/utils.js";
  defineProps(["worktimeInSeconds", "overtimeInSeconds"]);

</script>
<template>
  <section class="details">
    <DetailsContainer
      :label="'regular'"
      :data="formatTime(worktimeInSeconds).toString()"
      :background="'#282828'"
    />
    <DetailsContainer
      :label="'overtime'"
      :data="formatTime(overtimeInSeconds).toString()"
      :background="'#282828'"
      color="var(--color-text-overtime)"
    />
  </section>
</template>

<style scoped>

.details {
  background: var(--color-background-mute);
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  min-width: 300px;
  max-width: 80%;
  box-shadow: var(--vt-box-shadow);
}


@media (max-width: 1300px) {
  .details {
    min-width: 250px;
    max-width: 40%;
  }
}

@media (max-width: 730px) {

  .details {
    min-width: 250px;
    max-width: 40%;
    margin: 5px;
  }
}

</style>
