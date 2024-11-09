import {url} from "@/utils.js";


const addAuthorization = () => {
    const token = localStorage.getItem('token')
    return `Bearer ${token}`

}

export const checkIsAuthorized = async () => {

    const data = {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        }
    }

    const response = await fetch(url + '/user/me', data)

    if (response.status === 401) {
        localStorage.removeItem('token')
        return false
    }

    else if (!response.ok) {
      throw new Error('Checking authorization failed.')
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

export const getUsers = async () => {

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

export const getActiveShift = async (user_id) => {

    const data = {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const response = await fetch(url + `/shift/active?user_id=${user_id}`, data)

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

export const endShift = async (shiftId, userId ) => {
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
    const response = await fetch(url + '/shift/end', data)

    if (!response.ok) {
      throw new Error('Login failed. Please check your credentials.')
    }

    return await response.json()
}

export const getUserShifts = async (month) => {

    const data = {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        }
    }

    const response = await fetch(url + `/shift/user?month=${month}`, data)

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
   const response = await fetch(url + `/user/${user_id}/avatar`, data)

    if (!response.ok) {
      throw new Error('Register failed')
    }

    return await response.json()
}

export const saveShiftNote = async (user_id, shift_id, note) => {

    const body = JSON.stringify({
        'user_id': user_id,
        'shift_id': shift_id,
        'note': note
    })
    const data = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
    }
    try {
        const response = await fetch(url + '/shift/note', data)

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Couldn't add note");
        }

        return result

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
        headers: { 'Content-Type': 'application/json' },
        body: body,
    }
    try {
        const response = await fetch(url + '/shift/delete', data)

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Couldn't add note");
        }

        return result

    } catch (error) {
         console.error('Error:', error.message);
        throw error;
    }
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
        localStorage.removeItem('token')
        throw new Error(`user Me response error: ${response.statusText}`)

    }

    return await response.json()
}