// src/api/client.js
import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import { baseUrl } from './baseUrl';

const client = axios.create({
  baseURL: baseUrl,  
  headers: {
    'Content-Type': 'application/json',
  },
});


client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => handleApiError(error)
);

export default client;