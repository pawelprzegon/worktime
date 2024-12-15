import {deleteShiftFetch} from "@/composables/fetchers.js";

export const removeShift = async (shiftId, selectedDay, alert) => {
  try {
    const response = await deleteShiftFetch(shiftId);
    if (response) {
      selectedDay.shifts.list = selectedDay.shifts.list.filter(
        (shift) => shift.id !== shiftId
      );
      alert.show(response.status, response.message);
    }

    alert.show(response.status, response.message);
  } catch (error) {
    console.error("Error removing shift:", error);
    alert.show("error", "Failed to remove shift.");
  }
};