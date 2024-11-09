import {inject, ref} from 'vue';
import VueJwtDecode from 'vue-jwt-decode'

 const isAuthenticated = inject('isAuthenticated')

export const login = (token) => {
  if (isAuthenticated) {
    localStorage.setItem('token', token);
    const decodedToken = VueJwtDecode.decode(token);

    isAdmin.value = decodedToken.role === 'admin';
    localStorage.setItem('userId', decodedToken.id);
    isAuthenticated.status = true;
  } else {
    console.error('isAuthenticated is not available');
  }
};

export const logout = () => {
  if (isAuthenticated) {
    localStorage.removeItem('token');
    isAuthenticated.status = false;
  } else {
    console.error('isAuthenticated is not available');
  }
};
