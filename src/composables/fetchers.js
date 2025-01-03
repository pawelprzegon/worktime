import {clearCache, url} from "@/composables/utils.js";
import {format} from "date-fns";
import { useAuthStore } from '@/stores/authStore.js';

const addAuthorization = () => {
    const authStore = useAuthStore();
    return `Bearer ${authStore.$state.token}`

}

export const checkIsAuthorized = async () => {

    const data = {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        }
    }

    const response = await fetch(url + '/auth/check', data)

    if (!response.ok) {
        return false
    }

    return await response.json()
}

export const loginFetch = async (formData) => {
    const body = formData.toString()
    const data = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    }
   const response = await fetch(url + '/auth/login', data)

    if (!response.ok) {
      throw new Error('Login failed. Please check your credentials.')
    }

    return await response.json()
}

export const getDashUsers = async () => {

    const data = {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const response = await fetch(url + '/dash/users', data)
    if (!response.ok) {
      throw new Error('Login failed. Please check your credentials.')
    }

    return await response.json()
}

export const getActiveShifts = async () => {

    const data = {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const response = await fetch(url + '/shift/active', data)

    if (!response.ok) {
      throw new Error('Fetch active shift failed.')
    }

    return await response.json()
}

export const startShift = async (userId, note) => {

    const body = JSON.stringify({
        'user_id': `${userId}`,
        'note': note
    });

    const data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    }
    const response = await fetch(url + '/shift/start', data)

    if (!response.ok) {
      throw new Error('Login failed. Please check your credentials.')
    }

    return await response.json()
}

export const stopShift = async (shiftId, userId) => {
    const body = JSON.stringify({
        'shift_id': `${shiftId}`,
        'user_id': `${userId}`
    });

    const data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    }
    const response = await fetch(url + '/shift/stop', data)

    if (!response.ok) {
      throw new Error('Login failed. Please check your credentials.')
    }

    return await response.json()
}

export const getUserShifts = async (user_id, selectedMonth) => {

    const month = format(selectedMonth, 'yyyy-MM')

    const data = {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        }
    }
    let url_string = `/shift/user?month=${month}`
    if (user_id) {
        url_string += `&user_id=${user_id}`
    }
    const response = await fetch(url + url_string, data)

    if (!response.ok) {
      throw new Error('Fetch active shift failed.')
    }

    return await response.json()
}

export const registerUser = async (formData) => {

    const body = JSON.stringify(formData)
    const data = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
    }

   const response = await fetch(url + '/user/register', data)

    if (!response.ok) {
      throw new Error('Register failed')
    }

    return await response.json()
}

export const saveAvatar = async (user_id, avatar) => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    const data = {
        method: 'POST',
        body: formData,
    }
    try {
        const response = await fetch(url + `/user/${user_id}/avatar`, data)

        return await response.json();

    } catch (error) {
         console.error('Error:', error.message);
        throw error;
    }
}

export const saveShiftNote = async (user_id, shift_id, note) => {

    const body = JSON.stringify({
        'user_id': user_id,
        'shift_id': shift_id,
        'note': note
    })

    const data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        },
        body: body,
    }
    try {
        const response = await fetch(url + '/shift/note', data)

        return await response.json();

    } catch (error) {
         console.error('Error:', error.message);
        throw error;
    }
}

export const deleteShiftFetch = async (shift_id) => {

    const body = JSON.stringify({
        'shift_id': shift_id,
    })
    const data = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        },
        body: body,
    }
    try {
        const response = await fetch(url + '/shift/delete', data)

        return await response.json();

    } catch (error) {
         console.error('Error:', error.message);
        throw error;
    }
}

export const shiftCorrection = async (userId, shiftId, timeCorrection) => {
    const body = JSON.stringify({
        'shift_id': shiftId,
        'user_id': userId,
        'start': timeCorrection.start,
        'stop': timeCorrection.stop,
    });

    const data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        },
        body: body
    }

    try {
        const response = await fetch(url + '/shift/correction', data)

        return await response.json();

    } catch (error) {
         console.error('Error:', error.message);
        throw error;
    }
}

export const setToil = async (userId, toilId, counter, date) => {

    const body = JSON.stringify({
        'user_id': userId,
        'toil_id': toilId,
        'duration_seconds': counter,
        'date': date,
    });

    const data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        },
        body: body
    }
    try {
        const response = await fetch(url + '/toil/set', data)

        return await response.json();

    } catch (error) {
         console.error('Error:', error.message);
        throw error;
    }
}

export const getToil = async (user_id, selectedMonth) => {

    const year = format(selectedMonth, 'yyyy')
    const month = format(selectedMonth, 'MM')

    const data = {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        }
    }

    let url_string = `/toil/?year=${year}&month=${month}`
    if (user_id) {
        url_string += `&user_id=${user_id}`
    }

    const response = await fetch(url + url_string, data)

    if (!response.ok) {
      throw new Error('Fetch active shift failed.')
    }

    return await response.json()
}

export const getMe = async () => {
    const data = {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        }
    }

    const response = await fetch(url + `/user/me`, data)

    if (!response.ok) {
        clearCache()
        throw new Error(`user Me response error: ${response.statusText}`)

    }

    return await response.json()
}

export const getUsers = async () => {

    const data = {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        }
    }

    const response = await fetch(url + '/user/', data)
    if (!response.ok) {
      throw new Error('Login failed. Please check your credentials.')
    }

    return await response.json()
}

export const setManualShift = async (shiftTime, note) => {
    const authStore = useAuthStore();

    const body = JSON.stringify({
        'user_id': authStore.user.id,
        'start_time': shiftTime.start,
        'stop_time': shiftTime.stop,
        'note': note
    });

    const data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        },
        body: body
    }
    const response = await fetch(url + '/shift/manual', data)

    if (!response.ok) {
      throw new Error('Login failed. Please check your credentials.')
    }

    return await response.json()
}

export const getOVHistory = async (userId, year, month) => {

    const data = {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        },
    }
    let url_string = `/ov-history/?user_id=${userId}&year=${year}&month=${month}`
    const response = await fetch(url + url_string, data)

    if (!response.ok) {
      throw new Error('Fetch active shift failed.')
    }

    return await response.json()
}

export const setOVHistory = async (userId, year, month) => {

    const body = JSON.stringify({
        'user_id': userId,
        'year': year,
        'month': month
    })

    const data = {
      method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        },
        body: body
    }

    const response = await fetch(url + '/ov-history/set', data)

    if (!response.ok) {
      throw new Error('Fetch active shift failed.')
    }

    return await response.json()
}

export const validateResetPasswordURL = async (token) => {

    const data = {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }

    const response = await fetch(url + `/auth/validate-reset-password?token=${token}`, data)

    if (!response.ok) {
      throw new Error('Fetch validate reset password failed.')
    }

    return await response.json()
}

export const resetPassword = async (token, password) => {

    const body = JSON.stringify({
        'token': token,
        'password': password
    })

    const data = {
      method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        },
        body: body
    }

    const response = await fetch(url + '/auth/reset-password', data)

    if (!response.ok) {
      throw new Error('Fetch reset-password failed.')
    }

    return await response.json()
}