import { io } from 'socket.io-client';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
  withCredentials: true,
  autoConnect: false,
  auth: {
    token: getAuthToken()
  }
});

// Update auth token when it changes
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'authToken') {
      socket.auth = { token: e.newValue };
    }
  });
}

export default socket;