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

  <div
      class="grid mt-2 min-h-5"
      :class="shift.note ? 'grid-rows-[auto_50px]' : 'grid-rows-1'"
  >

    <div
        v-show="shift.note && !noteEdit"
        class="
        shift-note text-left px-3 font-thin

        portrait-2xs:text-2xs
        portrait-medium:text-base
        ">
      <small class="break-all">{{shift.note}}</small>
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
        label="edit"
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

</template>

<style scoped>

</style>