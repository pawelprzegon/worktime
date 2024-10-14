import { ref } from 'vue';
import VueJwtDecode from 'vue-jwt-decode'

export const isAuthenticated = ref(localStorage.getItem('token') !== null);
export const isAdmin = ref()

export const login = (token) => {
  localStorage.setItem('token', token);
  isAuthenticated.value = true;
  const decodedToken = VueJwtDecode.decode(token);
  isAdmin.value = decodedToken.role === 'admin';
};

export const logout = () => {
  localStorage.removeItem('token');
  isAuthenticated.value = false;
};
