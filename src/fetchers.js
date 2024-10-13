import {url} from "@/utils.js";


const addAuthorization = () => {
    const token = localStorage.getItem('token')
    return `Bearer ${token}`

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
    const startTime = new Date().toISOString();

    const body = JSON.stringify({
        'start': `${startTime}`,
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

export const getUserShifts = async () => {

    const data = {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': addAuthorization()
        }
    }

    const response = await fetch(url + `/shift/user`, data)

    if (!response.ok) {
      throw new Error('Fetch active shift failed.')
    }

    return await response.json()
}