import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem('accessToken');
  // 유라님 TODO이 여기서 토큰 handle 해주세요!
  //env ignoring test
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export default apiClient;
