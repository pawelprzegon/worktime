<script setup>

import CustomTextButton from "@/components/CustomTextButton.vue";
import {ref} from "vue";
import {saveShiftNote} from "@/composables/fetchers.js";
import {useAlertStore} from "@/stores/alertStore.js";
import {useSelectedMonthStore} from "@/stores/utilsStore.js";

const monthStore = useSelectedMonthStore('calendar')
const alert = useAlertStore()

const props = defineProps({
  shift: {
    type: Object,
  }
});

const noteContent = ref(props.shift.note)
const noteEdit = ref(false)

const toggleShowNoteEditor = () => {
  noteEdit.value = !noteEdit.value
}

const addNote = async () => {

  try {
    const response = await saveShiftNote(props.shift.user_id, props.shift.id, noteContent.value)
    props.shift.note = noteContent
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
      :class="props.shift.note ? 'grid-rows-[auto_50px]' : 'grid-rows-1'"
  >

    <div
        v-if="props.shift.note && !noteEdit"
        class="
        shift-note text-left px-3 font-thin

        portrait-2xs:text-2xs
        portrait-medium:text-base
        ">
      <small class="break-all">{{props.shift.note}}</small>
    </div>

    <form
        v-if="noteEdit"
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
        v-if="!noteEdit && props.shift.note !== ''"
        label="edit"
        @click="toggleShowNoteEditor"
      />
      <CustomTextButton
        v-if="!noteEdit && props.shift.note === ''"
        label="add note"
        @click="toggleShowNoteEditor"
      />
      <div
          v-if="noteEdit"
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