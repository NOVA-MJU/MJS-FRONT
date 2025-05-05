import apiClient from '@api/apiClient'

export const getUserInfo = async () => {
  try {
    const response = await apiClient.get('/members/info')
    return response.data
  } catch (e) {
    throw e
  }
}

export const patchUserInfo = async (data) => {
  try {
    const response = await apiClient.patch('/members/info', {

    })
    console.log(response.data)
    return response.data
  } catch (e) {
    throw e
  }
}

export const patchUserPassword = async (data) => {
  try {
    const response = await apiClient.patch('/members/info/password', {

    })
    console.log(response.data)
    return response.data
  } catch (e) {
    throw e
  }
}

export const deleteUserAccount = async (password) => {
  try {
    const response = await apiClient.delete('/members/info', {
      password,
    })
    console.log(response.data)
    return response.data
  } catch (e) {
    throw e
  }
}

export const getMyPosts = async () => {
  try {
    const response = await apiClient.get('/mypage/posts')
    return response.data
  } catch (e) {
    throw e
  }
}

export const getMyLikedPosts = async () => {
  try {
    const response = await apiClient.get('/mypage/liked_posts')
    return response.data
  } catch (e) {
    throw e
  }
}

export const getMyComments = async () => {
  try {
    const response = await apiClient.get('/mypage/commented_posts')
    return response.data
  } catch (e) {
    throw e
  }
}
