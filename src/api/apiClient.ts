import axios from 'axios';

/**
 * Refresh Token으로 새 Access Token 재발급 요청
 *
 * @async
 * @function reissueAccessToken
 * @throws {Error} refreshToken이 존재하지 않는 경우
 * @returns {Promise<string>} 새로 발급받은 Access Token 문자열
 */
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

/**
 * Axios 인스턴스
 *
 * - 기본 baseURL, JSON 헤더, withCredentials 옵션 설정
 * - 요청 시 Access Token 자동 헤더 추가
 * - 응답이 401 에러일 경우, Access Token 재발급 및 재시도
 *
 * @constant
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

/**
 * 요청 인터셉터
 *
 * - sessionStorage에서 accessToken을 읽어 Authorization 헤더에 추가
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    config.headers = config.headers ?? {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * 응답 인터셉터
 *
 * - 401 Unauthorized 발생 시 토큰 재발급 시도
 * - `/auth/login`, `/auth/reissue` 엔드포인트는 예외 처리
 * - 재발급 실패 시 세션 초기화 후 로그인 페이지로 리다이렉트
 *
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || '';

    // 로그인/재발급 엔드포인트의 401은 그대로 에러 반환
    if (status === 401 && (url.includes('/auth/login') || url.includes('/auth/reissue'))) {
      return Promise.reject(error);
    }

    // Access Token 만료 시 재발급 시도
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await reissueAccessToken();
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Refresh Token 만료 또는 재발급 실패', refreshError);
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
