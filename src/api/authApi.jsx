import apiClient from './apiClient';

export const postSignup = async (userData) => {
  try {
    const response = await apiClient.post('/members', userData);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postLogin = async (userInfo) => {
  try {
    const response = await apiClient.post('/auth/login', userInfo);
    return response.data;
  } catch (error) {
    console.error(error);
    throw (error);
  }
};

export const postLogout = async (accessToken) => {
  try {
    const response = await apiClient.post('/auth/logout', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postReissueAccessToken = async (refreshToken) => {
  try {
    const response = await apiClient.post('/auth/reissue', {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })
    return response
  } catch (e) {
    console.error(e)
    throw e
  }
}
