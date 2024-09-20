// client/src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Ensures cookies are sent with requests
});

export default API;
