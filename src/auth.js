// src/auth.js
import VueJwtDecode from 'vue-jwt-decode';
import {clearCache} from "@/utils.js";
import {checkIsAuthorized} from "@/fetchers.js";

export function getToken() {
    return sessionStorage.getItem('token');
}

export function setToken(token) {
    sessionStorage.setItem('token', token);
}

export function setUserId(userId) {
    sessionStorage.setItem('userId', userId)
}

export function decodeToken(token) {
    try {
        return VueJwtDecode.decode(token);
    } catch (error) {
        console.error("Token decoding error:", error);
        return null;
    }
}

export function getUserRole() {
    const token = getToken();
    const decoded = decodeToken(token);
    return decoded ? decoded.role : null;
}

export async function authorizationCheck() {
    const token = getToken();
    if (token) {
        const authorized = await checkIsAuthorized(token);
        if (authorized) {
            return authorized
        }
    }
    clearCache()
    return false
}

export function hasAccess(requiredRoles) {
    const userRole = getUserRole();

    if (Array.isArray(requiredRoles)) {
        return requiredRoles.includes(userRole);
    }
    return requiredRoles === userRole;
}

export function logout() {
   clearCache()
}

