import { useCallback, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlockTextEditor from '../../../components/organisms/BlockTextEditor';
import type { BlockNoteEditor } from '@blocknote/core';
import NavigationUp from '../../../components/molecules/NavigationUp';
import { getBlockTextEditorContentPreview } from '../../../components/organisms/BlockTextEditor/util';
import { postBoard } from '../../../api/board';
import { DOMAIN_VALUES } from '../../../api/s3upload';
import { FiChevronDown } from 'react-icons/fi';
import { useAuthStore } from '@/store/useAuthStore';
import LoginErrorPage from '@/pages/LoginError';

type Category = 'FREE' | 'NOTICE';
const CATEGORY_LABEL: Record<Category, string> = {
  FREE: '자유게시판',
  NOTICE: '정보게시판',
};

/**
 * 게시글 작성 페이지
 *
 * 새로운 게시글을 작성하는 페이지입니다.
 * 카테고리 선택(자유게시판/정보게시판), 제목, 본문을 입력할 수 있습니다.
 */
export default function BoardWrite() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const titleRef = useRef<HTMLInputElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<BlockNoteEditor>(null);

  const [isLoading, setIsLoading] = useState(false);

  // 수정사항 존재 여부
  const [isDirty, setIsDirty] = useState(false);

  // 카테고리
  const [isOpened, setIsOpened] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('FREE');
  const options: Category[] = ['FREE', 'NOTICE'];

  /**
   * 에디터 인스턴스를 불러옵니다.
   */
  const handleEditorReady = useCallback((editor: BlockNoteEditor) => {
    editorRef.current = editor;

    editor.onChange(() => {
      setIsDirty(true);
    });
  }, []);

  /**
   * 브라우저 새로고침 / 탭 닫기 / 외부 이동 시 경고
   */
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  /**
   * 상단 뒤로가기 눌렀을 때 확인
   */
  const handleBack = () => {
    if (isDirty) {
      const ok = window.confirm('작성 중인 내용이 사라집니다. 나가시겠습니까?');
      if (!ok) return;
    }
    navigate(-1);
  };

  /**
   * 게시글 업로드 요청
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
      const newPostUuid = await postBoard(title, selectedCategory, content, contentPreview, true);
      setIsDirty(false);
      navigate(`/board/${newPostUuid}`, { replace: true });
    } catch (e) {
      console.error('BoardWrite.tsx', e);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * editor의 블록 외부를 클릭했을 때 마지막 줄로 커서 이동
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

  if (!user) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center p-4 md:p-8'>
        <LoginErrorPage />
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 md:p-8'>
      {/* 상단 네비게이션 */}
      <div className='flex items-center justify-between'>
        <NavigationUp onClick={handleBack} />
      </div>

      {/* 제목 입력 */}
      <input
        className='placeholder-grey-20 border-blue-05 rounded-lg border-1 px-3 py-2 text-base font-semibold focus:outline-none md:border-2 md:py-3 md:text-3xl'
        placeholder='제목'
        ref={titleRef}
        onChange={() => setIsDirty(true)}
      />

      {/* 카테고리 선택 드롭다운 */}
      <div className='flex flex-col'>
        <button
          className='border-blue-05 flex justify-between rounded-lg border-1 px-4 py-2 text-base md:border-2'
          onClick={() => setIsOpened(!isOpened)}
        >
          <span className='text-blue-10'>{CATEGORY_LABEL[selectedCategory]}</span>
          <FiChevronDown
            size={22}
            className={`text-grey-20 ${isOpened ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`}
          />
        </button>

        {isOpened && (
          <div className='border-blue-05 mx-1 rounded-b-lg border-x-1 border-b-1 bg-white md:border-x-2 md:border-b-2'>
            {options.map((option) => (
              <div
                className='text-grey-40 hover:bg-blue-01 flex cursor-pointer px-4 py-2'
                key={option}
                onClick={() => {
                  setSelectedCategory(option);
                  setIsOpened(false);
                  setIsDirty(true);
                }}
              >
                {CATEGORY_LABEL[option]}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 에디터 */}
      <div
        className='border-blue-05 flex-1 cursor-text rounded-lg border-1 px-4 py-2 md:border-2 md:px-0'
        onClick={handleFocusEditor}
      >
        <div className='overflow-visible py-2 md:px-0' ref={editorWrapperRef}>
          <BlockTextEditor onEditorReady={handleEditorReady} domain={DOMAIN_VALUES[0]} />
        </div>
      </div>

      {/* 완료 버튼 */}
      <div className='flex justify-end'>
        <button
          className='bg-grey-10 w-24 cursor-pointer rounded-xl p-2 disabled:opacity-50 md:w-46 md:p-3'
          onClick={handleUploadPost}
          disabled={isLoading}
        >
          <p className='text-body02 text-black'>완료</p>
        </button>
      </div>
    </div>
  );
}
