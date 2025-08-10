import { Typography } from '../../../components/atoms/Typography';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlockTextEditor from '../../../components/organisms/BlockTextEditor';
import type { BlockNoteEditor } from '@blocknote/core';
import NavigationUp from '../../../components/molecules/NavigationUp';
import Divider from '../../../components/atoms/Divider';
import { getBlockTextEditorContentPreview } from '../../../components/organisms/BlockTextEditor/util';
import { postBoard } from '../../../api/board';

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

  return (
    <div className='w-full flex-1 px-9 py-12 gap-6 flex flex-col'>
      <Typography variant='heading01' className='text-mju-primary'>
        게시글 작성
      </Typography>
      <Divider />
      <div className='w-full flex justify-between items-center'>
        <NavigationUp onClick={() => navigate(-1)} />
        <button
          className='w-46 bg-grey-10 cursor-pointer p-3 rounded-xl'
          onClick={handleUploadPost}
        >
          <Typography variant='body02' className='text-black'>
            완료
          </Typography>
        </button>
      </div>
      <input
        className='p-3 placeholder-grey-20 font-bold text-[28px] focus:outline-none'
        placeholder='제목을 입력하세요'
        ref={titleRef}
      />
      <div
        className='flex-1 cursor-text'
        onClick={(e) => {
          /**
           * editor의 블록 외부를 클릭 했을 때 editor의 마지막 줄 마지막 부분으로 커서를 이동시킵니다. 이 함수는 editor의 블록 내부를 클릭 했을 때는 동작하지 않습니다.
           */
          const editor = editorRef.current;

          if (!editor) return;
          if (editorWrapperRef.current?.contains(e.target as Node)) return;

          const blocks = editor.document;

          if (blocks.length > 0) {
            const lastBlock = blocks[blocks.length - 1];
            editor.setTextCursorPosition(lastBlock.id, 'end');
          }

          editor.focus();
        }}
      >
        <div ref={editorWrapperRef}>
          <BlockTextEditor onEditorReady={handleEditorReady} />
        </div>
      </div>
    </div>
  );
}
