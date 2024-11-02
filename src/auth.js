import { ref } from 'vue';
import VueJwtDecode from 'vue-jwt-decode'

export const isAuthenticated = ref(localStorage.getItem('token') !== null);
export const isAdmin = ref()
export const loggedUserId = ref(localStorage.getItem('userId'))

export const login = (token) => {
  localStorage.setItem('token', token);
  isAuthenticated.value = true;
  const decodedToken = VueJwtDecode.decode(token);
  console.log(decodedToken.id)
  isAdmin.value = decodedToken.role === 'admin';
  localStorage.setItem('userId', decodedToken.id);
};

export const logout = () => {
  localStorage.removeItem('token');
  isAuthenticated.value = false;
};
