import axios from 'axios';

export const http = axios.create({
  baseURL: 'https://knklvl.xyz/api',    
  headers: {
    'Content-type': 'application/json',
  },
});

export const http1 = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URI,
  headers: {
    'Content-type': 'application/json',
  },
});
