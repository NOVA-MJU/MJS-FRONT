import apiClient from './apiClient';

//
export const getNotice = async ({
  category,
  year = new Date().getFullYear(),
  page = 0,
  size = 5,
}) => {
  try {
    const response = await apiClient.get('/notices', {
      params: { category, year, page, size },
    });
    // console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
