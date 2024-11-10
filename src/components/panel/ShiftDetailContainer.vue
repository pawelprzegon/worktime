<script setup>

const props = defineProps({
  label: String,
  data: String,
  background: String
})



</script>

<template>

  <div class="shift-detail"
       :style="{background: props.background}">
    <p>{{props.label}}:</p>
    <h3>{{props.data}}</h3>
  </div>

</template>

<style scoped>

.shift-detail {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  padding: 1px;
  margin: 0 0 1px 0;
  width: 100%;
}

.shift-detail p {
  color: gray
}

.shift-detail h3 {
  background: #3d3d3d;
  padding: 2px;
  width: 50%;
  border-radius: 3px;
}

</style>