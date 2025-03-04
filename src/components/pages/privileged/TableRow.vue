<script setup>
  import { computed } from "vue";
  import { format } from "date-fns";
  import { formatTime, getLast, getTime } from "@/composables/utils.js";
  import { usePrivilegedSelectedUser } from "@/stores/privilegedStore.js";
  import {useDayStore} from "@/stores/calendarStore.js";

  const props = defineProps({
    day: Object,
  });

  const dayStore = useDayStore();
  const selectedUser = usePrivilegedSelectedUser();

  const formattedDate = computed(() => format(props.day.date, "yyyy-MM-dd"));
  const offType = computed(() => props.day.offType || "");

  const overtime = computed(() => props.day.overtime ? formatTime(props.day.overtime) : "");
  const toil = computed(() => Object.keys(props.day.toil).length > 0 ? formatTime(props.day.toil.duration_seconds) : "");
  const regular = computed(() => props.day.regular ? formatTime(props.day.regular) : "");

  const dayData = computed(() => getLast(props.day));

  const regularClass = computed(() =>
    (props.day.regular + (props.day.toil?.duration_seconds || 0)) >= 28800
      ? "achieved"
      : "not-achieved"
  );

  const toilClass = computed(() =>
    (props.day.regular + (props.day.toil?.duration_seconds || 0)) >= 28800
      ? "achieved"
      : "not-achieved"
  );

  const setDayAndShift = (shift) => {
    dayStore.setDay(props.day)
    selectedUser.setShift(shift.id)
  }

</script>

<template>
  <tr>
    <td>{{ formattedDate }}</td>
    <td class="multiple-data">
      <p
        v-for="shift in dayData"
        :key="shift.id"
        :id="shift.id"
        @click="setDayAndShift(shift)"
      >
        {{ getTime(shift.start) }}
      </p>
    </td>
    <td class="multiple-data">
      <p v-for="shift in dayData" :key="'stop-' + shift.id">
        {{ getTime(shift.stop) }}
      </p>
    </td>
    <td :class="regularClass">{{ regular }}</td>
    <td>{{ overtime }}</td>
    <td :class="toilClass">{{ toil }}</td>
    <td class="not-achieved">{{ offType }}</td>
  </tr>
</template>
