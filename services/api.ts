import axios from 'axios';

const BASE_URL = 'http://192.168.18.12:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = () => api.get('/users');
export const createUser = (data: { name: string; email: string }) => api.post('/users', data);

export default api;