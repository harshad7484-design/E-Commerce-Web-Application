import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = 'Bearer ' + user.token;
    }
  } catch (e) {}
  return config;
});

export default api;