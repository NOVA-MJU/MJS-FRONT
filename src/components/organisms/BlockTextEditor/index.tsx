import type { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { useEffect } from 'react';
import { ko } from '@blocknote/core/locales';

interface BlockTextEditor {
  /**
   * 읽기 전용 모드를 활성화합니다. `true`일 경우 사용자가 게시글을 수정할 수 없습니다. 텍스트 에디터로 사용할 경우 값을 넣지 마세요.
   */
  readOnly?: boolean;

  /**
   * editor 인스턴스를 참조할 함수를 입력하세요. onEditorReady를 아래와 같이 useCallback으로 memoization해야 성능 저하가 발생하지 않습니다. 읽기 전용 모드인 경우 입력하지 마세요.
   *
   * ```tsx
   * const editorRef = useRef<BlockNoteEditor | null>(null);
   *
   * const handleEditorReady = useCallback((editor: BlockNoteEditor) => {
   *   editorRef.current = editor;
   * }, []);
   *
   * return <BlockTextEditor onEditorReady={handleEditorReady} />
   * ```
   *
   * editor에 focus 해야 되는 경우 다음과 같이 입력하십시오.
   *
   * ```tsx
   * editorRef.current?.focus();
   * ```
   *
   * editor의 값을 불러와야 하는 경우 다음과 같이 입력하세요.
   *
   * ```tsx
   * // JSON
   * JSON.stringify(editorRef.current?.document);
   *
   * // HTML
   * editorRef.current?.blocksToFullHTML(editorRef.current.document);
   * editorRef.current?.blocksToHTMLLossy(editorRef.current.document);
   * ```
   */
  onEditorReady?: (editor: BlockNoteEditor) => void;
}

/**
 * BlockTextEditor
 *
 * 오픈 소스 BlockNote 기반 텍스트 에디터 입니다.
 *
 * @param readOnly? 읽기 전용 모드 여부를 입력하세요.
 * @param onEditorReady? editor 인스턴스를 참조할 함수를 입력하세요.
 * @returns JSX.Element
 */
export default function BlockTextEditor({ readOnly = false, onEditorReady }: BlockTextEditor) {
  /**
   * 에디터 인스턴스를 생성합니다
   */
  const editor = useCreateBlockNote({
    dictionary: ko,
  });

  /**
   * 생성된 에디터 인스턴스를 부모로 전달합니다
   * 읽기 전용 모드에서는 동작하지 않습니다
   */
  useEffect(() => {
    if (onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  return <BlockNoteView editor={editor} editable={!readOnly} theme='light' />;
}
