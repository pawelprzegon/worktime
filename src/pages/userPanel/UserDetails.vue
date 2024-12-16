
<script setup>
  import DetailsContainer from "@/pages/userPanel/DetailsContainer.vue";

  defineProps(["firstName", "lastName", "email", "role"]);

</script>
<template>

    <section class="details">
      <DetailsContainer :label="'firstname'" :data="firstName" :background="'#282828'" :color="'#CCCCCCFF'"/>
      <DetailsContainer :label="'lastname'" :data="lastName" :background="'#282828'" :color="'#CCCCCCFF'"/>
      <DetailsContainer :label="'email'" :data="email" :background="'#282828'" :color="'#CCCCCCFF'"/>
      <DetailsContainer :label="'role'" :data="role" :background="'#282828'" :color="'#CCCCCCFF'"/>
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


