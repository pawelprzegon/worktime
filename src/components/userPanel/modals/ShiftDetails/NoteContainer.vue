<script setup>

import CustomTextButton from "@/components/CustomTextButton.vue";
import {ref} from "vue";
import {saveShiftNote} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";
import {usedayStore} from "@/stores/calendarStore.js";

const dayStore = usedayStore()
const monthStore = useSelectedMonthStore('calendar')
const alert = useAlertStore()

const props = defineProps({
  shiftId: {
    type: String,
    required: true,
  }
});

const shift = dayStore.getShiftById(props.shiftId)

const noteContent = ref(shift.value.note)
const noteEdit = ref(false)

const toggleShowNoteEditor = () => {
  noteEdit.value = !noteEdit.value
}

const addNote = async () => {

  try {
    const response = await saveShiftNote(shift.value.user_id, shift.value.id, noteContent.value)
    shift.value.note = noteContent
    alert.show(response.status, response.message)
    noteEdit.value = false;
    await monthStore.refresh()
  } catch (error) {
    alert.show('error', error.message)
  }

};

</script>

<template>
  <div class="grid grid-cols-[40px_auto] my-5

              portrait-2xs:grid-cols-[24px_auto]
              portrait-xs:grid-cols-[28px_auto]
              portrait-small:grid-cols-[32px_auto]
              portrait-medium:grid-cols-[36px_auto]
              portrait-large:grid-cols-[40px_auto]
  "
  >

    <img
        src="../../../../assets/img/write.png"
        alt="location"
        class="filter-invert-100
              portrait-2xs:w-[16px]
              portrait-xs:w-[20px]
              portrait-small:w-[24px]
              portrait-medium:w-[28px]
              portrait-large:w-[32px]
              "

    />
    <div
      class="grid min-h-5"
      :class="shift.note ? 'grid-rows-[auto_50px]' : 'grid-rows-1'"
  >

    <div
        v-show="shift.note && !noteEdit"
        class="
        shift-note text-left font-thin

        portrait-2xs:text-2xs
        portrait-medium:text-base
        ">
      <p class="break-all px-3 text-white">{{shift.note}}</p>
    </div>

    <form
        v-show="noteEdit"
        @submit.prevent.stop="addNote" ref="noteForm">
      <textarea
        class="
        rounded-md w-[95%] p-1 text-black

        portrait-2xs:text-2xs
        portrait-medium:text-base
        "
        v-model="noteContent"
        id="noteEditor"
        name="noteEditor"
        rows="2"
      />
    </form>
    <div
        class="place-items-end">
      <CustomTextButton
        v-show="!noteEdit && shift.note !== ''"
        label="edit note"
        @click="toggleShowNoteEditor"
      />
      <CustomTextButton
        v-show="!noteEdit && shift.note === ''"
        label="add note"
        @click="toggleShowNoteEditor"
      />
      <div
          v-show="noteEdit"
          class="grid grid-flow-col"
      >
          <CustomTextButton
            label="save"
            @click="addNote"
          />
          <CustomTextButton
            label="cancel"
            @click="toggleShowNoteEditor"
          />
      </div>
    </div>


  </div>
  </div>

</template>

<style scoped>

</style>