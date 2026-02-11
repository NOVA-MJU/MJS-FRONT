import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../../../../components/atoms/Button';
import Divider from '../../../../components/atoms/Divider';
import { Typography } from '../../../../components/atoms/Typography';
import NavigationUp from '../../../../components/molecules/NavigationUp';
import BlockTextEditor from '../../../../components/organisms/BlockTextEditor';
import type { BlockNoteEditor } from '@blocknote/core';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  getBlockTextEditorContentPreview,
  getBlockTextEditorImageThumbnail,
} from '../../../../components/organisms/BlockTextEditor/util';
import { getDepartmentNoticeDetail, updateDepartmentNotice } from '../../../../api/admin';
import { DOMAIN_VALUES } from '../../../../api/s3upload';
import GlobalErrorPage from '../../../error';

/**
 * 관리자 공지사항 수정 페이지
 *
 * 학과 관리자가 기존 공지사항을 수정하는 페이지입니다.
 * 제목과 본문을 수정할 수 있으며, 수정 전 확인 모달을 표시합니다.
 */
export default function AdminNoticeEdit() {
  const { departmentUuid, noticeUuid } = useParams<{
    departmentUuid: string;
    noticeUuid: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<BlockNoteEditor>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [title, setTitle] = useState('');
  const [initialContent, setInitialContent] = useState('');

  /**
   * 공지사항 데이터 초기값을 불러옵니다
   */
  useEffect(() => {
    if (!departmentUuid || !noticeUuid) {
      setIsError(true);
      return;
    }
    (async () => {
      try {
        const res = await getDepartmentNoticeDetail(departmentUuid, noticeUuid);
        setTitle(res.title);
        setInitialContent(res.content);
      } catch (e) {
        console.error(e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [departmentUuid, noticeUuid]);

  /**
   * 에디터 인스턴스를 불러옵니다.
   */
  const handleEditorReady = useCallback((editor: BlockNoteEditor) => {
    editorRef.current = editor;
  }, []);

  /**
   * 공지사항 수정 요청 함수입니다. 제목 또는 본문이 없는 경우 동작하지 않습니다.
   */
  const handleUpdatePost = async () => {
    if (isLoading || !departmentUuid || !noticeUuid) return;

    const trimedTitle = title.trim() ?? '';
    const content = JSON.stringify(editorRef.current?.document);
    const contentPreview = getBlockTextEditorContentPreview(content);
    const thumbnail = getBlockTextEditorImageThumbnail(content);

    if (!trimedTitle) {
      alert('공시자항 제목을 입력하세요');
      return;
    }

    if (editorRef.current?.isEmpty) {
      alert('공지사항 본문을 입력하세요');
      return;
    }

    setIsLoading(true);
    try {
      await updateDepartmentNotice(
        departmentUuid,
        noticeUuid,
        title,
        content,
        contentPreview,
        thumbnail,
      );
      if (location.state?.from === 'detail') navigate(-1);
      else navigate(`/admin/${departmentUuid}/notice/${noticeUuid}`, { replace: true });
    } catch (e) {
      console.error('BoardWrite.tsx', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isError) return <GlobalErrorPage />;

  return (
    <div className='flex-1 flex flex-col p-6 gap-6'>
      <div className='flex items-center justify-between gap-6'>
        <NavigationUp onClick={() => navigate(-1)} />
        <Button variant='blue35' shape='rounded' onClick={handleUpdatePost}>
          저장
        </Button>
      </div>
      <Typography variant='heading01' className='text-mju-primary'>
        공지사항 작성
      </Typography>
      <Divider />
      <input
        className='p-3 placeholder-grey-20 font-bold text-[28px] focus:outline-none'
        placeholder='공지사항 제목을 입력하세요'
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
            domain={DOMAIN_VALUES[4]}
            initialContent={initialContent}
          />
        </div>
      </div>
    </div>
  );
}
