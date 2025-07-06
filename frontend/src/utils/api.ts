import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Get token from localStorage instead of store to avoid circular dependency
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('authToken');
  }
  
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  if (config.data) {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(config.data),
      process.env.NEXT_PUBLIC_CRYPTO_SECRET!
    ).toString();
    config.data = { data: encryptedData };
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data) {
      const bytes = CryptoJS.AES.decrypt(
        response.data.data,
        process.env.NEXT_PUBLIC_CRYPTO_SECRET!
      );
      response.data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;