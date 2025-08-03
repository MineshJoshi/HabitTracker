import axios from 'axios';

// Render se mila URL yahan daal diya hai
const API_URL = 'https://habittracker-server-rhbo.onrender.com'; 

const api = axios.create({
  baseURL: API_URL,
});

// Yeh har request ke saath token apne aap bhej dega
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;