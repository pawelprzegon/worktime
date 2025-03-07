<script setup>
import {ref, onMounted} from 'vue'
import Avatar from "@/components/Avatar.vue";
import UserName from "@/components/UserName.vue";
import '@/assets/modal.css';
import ModalWrapper from "@/components/ModalWrapper.vue";
import Location from "@/components/dash/Location.vue";
import {useLocationStore} from "@/stores/utilsStore.js";

const location = useLocationStore()

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  activeShift: {
    type: Object,
    default: {}
  },
  closeModal: {
    type: Function,
    required: true
  }
})
const emit = defineEmits(['closeModal', 'toggleShift'])

const label = ref('')

onMounted(() => {
  const isShiftActive = props.activeShift;
  label.value = {
    data: isShiftActive ? 'Stop shift?' : 'Start shift?',
    color: isShiftActive ? 'red' : 'green',
  };
});

</script>

<template>
  <ModalWrapper :close-modal="props.closeModal">
    <div
      class="bg-mute shadow-xl text-center rounded-lg m-auto border-2 p-4 relative"
      :class="props.activeShift ? 'border-red-700' : 'border-emerald-700'"
    >
      <div class="grid grid-cols-2 gap-4">
        <div class="relative">
          <div class="w-full h-[100%]">
            <Location
                :activeShift="props.activeShift"
            />
          </div>
        </div>

        <div class="flex flex-col items-center">
          <Avatar
            :avatar="props.user.avatar"
            :active-shift="props.user.activeShift"
            :static="true"
          />
          <UserName
            :first-name="props.user.first_name"
            :last-name="props.user.last_name"
          />

          <h2
            class="mt-4 font-extrabold text-2xl"
            :class="props.activeShift ? 'text-red-500' : 'text-emerald-700'"
          >
            {{ label.data }}
          </h2>

          <div
              class="p-2 my-2 w-full">
            <p
              class="bg-secondary text-xl w-full rounded-md p-2 m-1 border-2 border-third font-medium hover:bg-beb hover:text-white hover:border-beb hover:cursor-pointer"
              @click="emit('toggleShift')"
            >
              Yes
            </p>
            <p
              class="bg-secondary text-xl w-full rounded-md  p-2 m-1 border-2 border-third font-medium hover:bg-silver hover:text-white hover:border-silver hover:cursor-pointer"
              @click="props.closeModal()"
            >
              No
            </p>
          </div>
        </div>
      </div>
    </div>
  </ModalWrapper>
</template>

<style scoped>

</style>