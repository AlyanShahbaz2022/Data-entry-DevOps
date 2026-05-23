import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/users',
  headers: { 'Content-Type': 'application/json' },
});

export const getUsers = () => api.get('/').then((r) => r.data);
export const getUser = (id) => api.get(`/${id}`).then((r) => r.data);
export const createUser = (data) => api.post('/', data).then((r) => r.data);
export const updateUser = (id, data) => api.put(`/${id}`, data).then((r) => r.data);
export const deleteUser = (id) => api.delete(`/${id}`).then((r) => r.data);
