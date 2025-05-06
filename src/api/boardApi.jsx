import apiClient from "./apiClient";

export const getBoardContents = async (page = 0, size = 10) => {
  try {
    const response = await apiClient.get("/boards", {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getBoardContent = async (uuid) => {
  if (!uuid) {
    throw new Error("getBoardView 중 오류 발생: uuid가 지정되지 않았습니다.");
  }

  try {
    const response = await apiClient.get(`/boards/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const postBoardContent = async (title, content, published, contentImage = []) => {
  if (!title)
    throw new Error("제목을 입력해 주세요");
  if (!content)
    throw new Error("본문 내용을 입력해주세요");
  if (typeof published !== "boolean")
    throw new Error("공개 여부가 지정되지 않았습니다");

  try {
    const response = await apiClient.post("/boards", {
      title,
      content,
      published,
      contentImage,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const patchBoardContent = async (uuid, title, content, published, contentImage = []) => {
  if (!uuid)
    throw new Error("patchBoard중 오류 발생: uuid가 지정되지 않았습니다");
  if (!title)
    throw new Error("patchBoard중 오류 발생: title이 지정되지 않았습니다");
  if (!content)
    throw new Error("patchBoard중 오류 발생: content가 지정되지 않았습니다");
  if (typeof published !== "boolean")
    throw new Error("patchBoard중 오류 발생: published가 지정되지 않았습니다");

  try {
    const response = await apiClient.patch(`/boards/${uuid}`, {
      title,
      content,
      published,
      contentImage,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteBoardContent = async (uuid) => {
  if (!uuid)
    throw new Error("deleteBoard중 오류 발생: uuid가 지정되지 않았습니다")

  try {
    const response = await apiClient.delete(`/boards/${uuid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const postBoardLike = async (uuid) => {
  if (!uuid)
    throw new Error('postBoardLike중 오류 발생: uuid가 지정되지 않았습니다')

  try {
    const response = await apiClient.post(`/boards/${uuid}/like`)
    return response.data
  } catch (e) {
    throw e
  }
}
