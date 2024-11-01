<script setup>
import {ref, defineEmits, computed} from 'vue'
import DetailsContainer from "@/components/panel/DetailsContainer.vue";

const props = defineProps({

  shifts: {
    type: Array,
    default: () => []
  },
  formatTime: {
    type: Function,
    required: true
  }
})

const date = computed(() => {
  if (props.shifts.length > 0) {
    return props.shifts[0].start.split("T")[0];
  }
  return '';
});

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')

}

</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <p class="modal-label">Day details</p>

      <div
          v-if="props.shifts.length > 0"
          class="shifts-container"
      >
        <p>{{date}}</p>

        <div
            v-for="shift in props.shifts"
            :key="shift.id"
            class="shift-details"
        >

          <DetailsContainer
            :label="'started'"
            :data="shift.start"
          />

          <DetailsContainer
            :label="'stopped'"
            :data="shift.stop"
          />

          <DetailsContainer
            v-if="shift.note"
            :label="'note'"
            :data="shift.note"
          />

          <DetailsContainer
            v-else
            :label="'note'"
            :data="''"
          />

          <DetailsContainer
            :label="'work'"
            :data="props.formatTime(shift.work)"
          />

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(30, 30, 30, 0.06);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #3d3d3d;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  width: 70%;
}

.modal-label {
  display: block;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.shifts-container {
  background-color: gray;
  color: #fff;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
}

.shift-details {
  background: #454545;
  padding: 10px;
  margin: 0 0 5px 0;
  font-size: 13px;
  border-radius: 5px;
}
</style>
