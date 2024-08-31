import axios from 'axios';

// Create an instance for your main API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/users/', 
});


export const pinCodeApi = axios.create({
  baseURL: 'https://api.postalpincode.in/',
});

export default api;
