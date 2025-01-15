import {getOVHistory, getToil, getUserShifts} from "@/composables/fetchers.js";

export const fetchOvHistory = async (userId, month) => {
  try {

    const monthValue = month.getMonth() + 1;
    const yearValue = month.getFullYear();
    return await getOVHistory(userId, yearValue, monthValue);

  } catch (error) {
    console.error("Error fetching Overtime History:", error);
    return null
  }
}

export const fetchUserShifts = async (userId, month) => {
  try {
    const shifts = await getUserShifts(userId, month);
    const toils = await getToil(userId, month);
    return { shifts, toils };
  } catch (error) {
    console.log(error.message)
    alert.show('error', error.message)
    return { shifts: [], toils: [] };
  }
};
