/**
 * 게시글 본문의 첫 번째 줄을 텍스트 형식으로 반환합니다.
 *
 * @param {string} content - 컨텐츠 본문 전체를 `string` 타입으로 전달하세요.
 * @returns {string} - 컨텐츠의 첫 번째 줄을 `string` 타입으로 반환합니다.
 */
export function getBlockTextEditorContentPreview(content: string) {
  const blocks = JSON.parse(content);

  if (!blocks) return '';

  for (let i = 0; i < blocks.length; i++) {
    const line = blocks[i].content
      //@ts-expect-error supress: `c`의 값이 보장되므로 오류가 발생하지 않습니다
      ?.map((c) => c.text)
      .join('')
      .trim();
    if (line) return line;
  }
  return '미리보기가 없습니다';
}

/**
 * Block Note Editor의 JSON 데이터에서 첫 번째 이미지 URL을 찾습니다.
 *
 * @param {string} content - 편집기 콘텐츠를 담고 있는 JSON 형식의 문자열.
 * @returns {string|null} - 첫 번째 이미지의 URL을 찾아 문자열로 반환합니다. 이미지가 없으면 null을 반환합니다.
 */
export function getBlockTextEditorImageThumbnail(content: string) {
  try {
    const blocks = JSON.parse(content);

    for (const block of blocks) {
      if (block.type === 'image' && block.props && block.props.url) {
        return block.props.url;
      }
    }

    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
