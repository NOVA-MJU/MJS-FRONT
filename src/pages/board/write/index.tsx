import { postBoard } from '@/api/board';
import { DOMAIN_VALUES } from '@/api/s3upload';
import Divider from '@/components/atoms/Divider';
import NavigationUp from '@/components/molecules/NavigationUp';
import BlockTextEditor from '@/components/organisms/BlockTextEditor';
import { getBlockTextEditorContentPreview } from '@/components/organisms/BlockTextEditor/util';
import type { BlockNoteEditor } from '@blocknote/core';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BoardWrite() {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLInputElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<BlockNoteEditor>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 에디터 인스턴스를 불러옵니다.
   */
  const handleEditorReady = useCallback((editor: BlockNoteEditor) => {
    editorRef.current = editor;
  }, []);

  /**
   * 게시글 업로드 요청 함수입니다. 제목 또는 본문이 없는 경우 동작하지 않습니다.
   */
  const handleUploadPost = async () => {
    if (isLoading) return;

    const title = titleRef.current?.value.trim() ?? '';
    const content = JSON.stringify(editorRef.current?.document);
    const contentPreview = getBlockTextEditorContentPreview(content);

    if (!title) {
      alert('제목을 입력하세요');
      return;
    }

    if (editorRef.current?.isEmpty) {
      alert('본문을 입력하세요');
      return;
    }

    setIsLoading(true);
    try {
      const newPostUuid = await postBoard(title, content, contentPreview);
      navigate(`/board/${newPostUuid}`, { replace: true });
    } catch (e) {
      console.error('BoardWrite.tsx', e);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * editor의 블록 외부를 클릭 했을 때 editor의 마지막 줄 마지막 부분으로 커서를 이동시킵니다. 이 함수는 editor의 블록 내부를 클릭 했을 때는 동작하지 않습니다.
   */
  const handleFocusEditor = (e: React.MouseEvent<HTMLDivElement>) => {
    const editor = editorRef.current;

    if (!editor) return;
    if (editorWrapperRef.current?.contains(e.target as Node)) return;

    const blocks = editor.document;

    if (blocks.length > 0) {
      const lastBlock = blocks[blocks.length - 1];
      editor.setTextCursorPosition(lastBlock.id, 'end');
    }

    editor.focus();
  };

  return (
    <div className='flex-1 p-4 md:p-8 gap-6 flex flex-col'>
      <h2 className='text-heading01 text-mju-primary'>게시글 작성</h2>
      <Divider />
      <div className='flex justify-between items-center'>
        <NavigationUp onClick={() => navigate(-1)} />
        <button
          className='w-24 md:w-46 bg-grey-10 cursor-pointer p-3 text-body02 rounded-xl'
          onClick={handleUploadPost}
        >
          완료
        </button>
      </div>
      <div className='rounded-xl border-2 border-blue-05'>
        <input
          id='post-title'
          name='post-title'
          className='w-full p-3 placeholder-grey-20 font-bold text-body02 focus:outline-none'
          placeholder='제목을 입력하세요'
          ref={titleRef}
        />
      </div>
      <div
        className='flex-1 cursor-text rounded-xl border-2 border-blue-05 p-3'
        onClick={handleFocusEditor}
      >
        <div ref={editorWrapperRef}>
          <BlockTextEditor onEditorReady={handleEditorReady} domain={DOMAIN_VALUES[0]} />
        </div>
      </div>
    </div>
  );
}
