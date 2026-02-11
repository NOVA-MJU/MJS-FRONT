import type { BlockNoteEditor } from '@blocknote/core';
import { useCallback, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getBlockTextEditorContentPreview,
  getBlockTextEditorImageThumbnail,
} from '../../../../components/organisms/BlockTextEditor/util';
import { writeDepartmentNotice } from '../../../../api/admin';
import NavigationUp from '../../../../components/molecules/NavigationUp';
import Button from '../../../../components/atoms/Button';
import { Typography } from '../../../../components/atoms/Typography';
import Divider from '../../../../components/atoms/Divider';
import BlockTextEditor from '../../../../components/organisms/BlockTextEditor';
import { DOMAIN_VALUES } from '../../../../api/s3upload';

/**
 * 관리자 공지사항 작성 페이지
 *
 * 학과 관리자가 새로운 공지사항을 작성하는 페이지입니다.
 * 제목과 본문을 입력하고 이미지를 첨부할 수 있습니다.
 */
export default function AdminNoticeWrite() {
  const { departmentUuid } = useParams<{ departmentUuid: string }>();
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
   * 공지사항 업로드 요청 함수입니다. 제목 또는 본문이 없는 경우 동작하지 않습니다.
   */
  const handleUploadPost = async () => {
    if (isLoading || !departmentUuid) return;

    const title = titleRef.current?.value.trim() ?? '';
    const content = JSON.stringify(editorRef.current?.document);
    const contentPreview = getBlockTextEditorContentPreview(content);
    const thumbnail = getBlockTextEditorImageThumbnail(content);
    if (!title) {
      alert('공지사항 제목을 입력하세요');
      return;
    }

    if (editorRef.current?.isEmpty) {
      alert('공지사항 본문을 입력하세요');
      return;
    }

    setIsLoading(true);
    try {
      const res = await writeDepartmentNotice(
        departmentUuid,
        title,
        content,
        contentPreview,
        thumbnail,
      );
      navigate(`/admin/${departmentUuid}/notice/${res.uuid}`, { replace: true });
    } catch (e) {
      console.error('BoardWrite.tsx', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex-1 flex flex-col p-6 gap-6'>
      <div className='flex items-center justify-between gap-6'>
        <NavigationUp onClick={() => navigate(-1)} />
        <Button variant='blue35' shape='rounded' onClick={handleUploadPost}>
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
          <BlockTextEditor onEditorReady={handleEditorReady} domain={DOMAIN_VALUES[4]} />
        </div>
      </div>
    </div>
  );
}
