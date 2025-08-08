import axios from 'axios';

// 토큰 재발급 요청 함수
const reissueAccessToken = async (): Promise<string> => {
  const refreshToken = sessionStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token found');

  const response = await axios.post(
    import.meta.env.VITE_API_BASE_URL + '/auth/reissue',
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    },
  );

  const newAccessToken = response.data.data.accessToken;
  sessionStorage.setItem('accessToken', newAccessToken);
  return newAccessToken;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터 - 토큰 만료 시 재발급 로직 추가
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await reissueAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Refresh Token 만료 또는 재발급 실패', refreshError);
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
