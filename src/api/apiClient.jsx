import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = cookies.get('accessToken');
    // const refreshToken = cookies.get('refreshToken');

    if (accessToken) {
      // config.headers['ACCESS-AUTH-KEY'] = `Bearer ${accessToken}`;
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    // if (refreshToken) {
    //   config.headers['REFRESH-AUTH-KEY'] = `Bearer ${refreshToken}`;
    // }

    // console.log(
    //   'API 요청:',
    //   config.method,
    //   config.baseURL + config.url,
    //   config.headers
    // );
    return config;
  },
  (e) => {
    return Promise.reject(e);
  }
);

// 응답 인터셉터 (API 응답을 받은 후 실행)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 오류 발생 시 -> 토큰 갱신 시도
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      console.log('call access token reissue function');
      originalRequest._retry = true;

      try {
        const newAccessToken = await reissueAccessToken();
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); // 🔄 재요청
      } catch (e) {
        console.error('error apiClient.jsx (refreshError)', e)
        cookies.remove('accessToken', { path: '/' })
        cookies.remove('refreshToken', { path: '/' })
        window.location.href = '/login';
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export const reissueAccessToken = async () => {
  try {
    const refreshToken = cookies.get('refreshToken');

    if (!refreshToken) {
      console.error('error apiClient.jsx refresh token이 없습니다')
      throw new Error('Refresh Token이 없습니다.');
    }

    const response = await axios.post(
      import.meta.env.VITE_API_BASE_URL + '/auth/reissue',
      {},
      {
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
        },
      }
    )

    cookies.set('accessToken', response.data.data.accessToken)
    // cookies.remove('accessToken')
    console.log('새 access token', cookies.get('accessToken'))
    return response.data
  } catch (e) {
    console.error('error apiClient.jsx', e)
    throw e
  }
}

// ✅ 최종 API 클라이언트 내보내기
export default apiClient
