import { Typography } from '../../../components/atoms/Typography';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BlockTextEditor from '../../../components/organisms/BlockTextEditor';
import type { BlockNoteEditor } from '@blocknote/core';
import NavigationUp from '../../../components/molecules/NavigationUp';
import Divider from '../../../components/atoms/Divider';
import { getBlockTextEditorContentPreview } from '../../../components/organisms/BlockTextEditor/util';
import { getBoardDetail, updatePost } from '../../../api/board';
import { DOMAIN_VALUES } from '../../../api/s3upload';

/**
 * 게시글 수정 페이지
 *
 * 기존 게시글을 수정하는 페이지입니다.
 * 제목과 본문을 수정할 수 있으며, 수정 전 확인 모달을 표시합니다.
 */
export default function BoardEdit() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<BlockNoteEditor>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [initialContent, setInitialContent] = useState('');

  /**
   * 게시글이 수정 모드여야하고, 현재 uuid와 content를 editor에 반영합니다
   */
  useEffect(() => {
    if (!uuid) return;
    (async () => {
      try {
        const res = await getBoardDetail(uuid);
        setInitialContent(res.content);
        setTitle(res.title);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [uuid]);

  /**
   * 에디터 인스턴스를 불러옵니다.
   */
  const handleEditorReady = useCallback((editor: BlockNoteEditor) => {
    editorRef.current = editor;
  }, []);

  /**
   * 게시글 수정 요청 함수입니다. 제목 또는 본문이 없는 경우 동작하지 않습니다.
   */
  const handleUploadPost = async () => {
    if (isLoading || !uuid) return;

    const parsedTitle = title.trim() ?? '';
    const content = JSON.stringify(editorRef.current?.document);
    const contentPreview = getBlockTextEditorContentPreview(content);

    if (!parsedTitle) return alert('제목을 입력하세요');
    if (editorRef.current?.isEmpty) return alert('본문을 입력하세요');

    setIsLoading(true);
    try {
      const newPostUuid = await updatePost(uuid, parsedTitle, content, contentPreview);
      if (location.state?.from === 'detail') navigate(-1);
      else navigate(`/board/${newPostUuid}`, { replace: true });
    } catch (e) {
      console.error('BoardWrite.tsx', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full flex-1 p-4 md:p-8 gap-4 md:gap-6 flex flex-col'>
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
          <BlockTextEditor
            onEditorReady={handleEditorReady}
            domain={DOMAIN_VALUES[0]}
            initialContent={initialContent}
          />
        </div>
      </div>
    </div>
  );
}
