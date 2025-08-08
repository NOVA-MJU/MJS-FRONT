/**
 * 게시글 본문의 첫 번째 줄을 텍스트 형식으로 반환합니다.
 *
 * @param 컨텐츠 본문 전체를 `string` 타입으로 전달하세요.
 * @returns 컨텐츠의 첫 번째 줄을 `string` 타입으로 반환합니다.
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
  return '';
}
