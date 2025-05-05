import apiClient from "./apiClient";

export const getBoardComments = async (boardUuid) => {
  try {
    const response = await apiClient.get(`/boards/${boardUuid}/comments`);
    return response.data;
  } catch (e) {
    console.error('error commentApi.jsx', e)
    throw e;
  }
}

export const postBoardComment = async (boardUuid, content) => {
  if (!content)
    throw new Error("내용을 입력해 주세요");

  try {
    const response = await apiClient.post(`/boards/${boardUuid}/comments`, {
      content
    });
    return response.data;
  } catch (e) {
    console.error('error commentApi.jsx', e)
    throw e;
  }
}

export const postLikeComment = async (boardUuid, commentUuid) => {
  if (!boardUuid)
    throw new Error('error commentApi.jsx: boardUuid is null')
  if (!commentUuid)
    throw new Error('error commentApi.jsx: commentUuid is null')

  try {
    const response = await apiClient.post(`/boards/${boardUuid}/comments/${commentUuid}/like`)
    return response.data
  } catch (e) {
    console.error('error commentApi.jsx', e)
    throw (e)
  }
}

export const deleteBoardComment = async (commentUuid) => {
  try {
    const response = await apiClient.delete(`/boards/comments/${commentUuid}`);
    return response;
  } catch (e) {
    console.error(e)
    throw e;
  }
}
