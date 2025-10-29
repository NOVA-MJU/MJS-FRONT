import { useCallback, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlockTextEditor from '../../../components/organisms/BlockTextEditor';
import type { BlockNoteEditor } from '@blocknote/core';
import NavigationUp from '../../../components/molecules/NavigationUp';
import { getBlockTextEditorContentPreview } from '../../../components/organisms/BlockTextEditor/util';
import { postBoard } from '../../../api/board';
import { DOMAIN_VALUES } from '../../../api/s3upload';
import { FiChevronDown } from 'react-icons/fi';

type Category = 'FREE' | 'NOTICE';
const CATEGORY_LABEL: Record<Category, string> = {
  FREE: '자유게시판',
  NOTICE: '정보게시판',
};

export default function BoardWrite() {
  const navigate = useNavigate();
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

  return (
    <div className='flex-1 p-4 md:p-8 gap-6 flex flex-col'>
      {/* 상단 네비게이션 */}
      <div className='flex justify-between items-center'>
        <NavigationUp onClick={handleBack} />
      </div>

      {/* 제목 입력 */}
      <input
        className='py-2 px-3 placeholder-grey-20 font-semibold text-base border-blue-05 border-1 md:border-2 rounded-lg focus:outline-none md:py-3 md:text-3xl'
        placeholder='제목'
        ref={titleRef}
        onChange={() => setIsDirty(true)}
      />

      {/* 카테고리 선택 드롭다운 */}
      <div className='flex flex-col'>
        <button
          className='flex py-2 px-4 text-base border-1 md:border-2 justify-between border-blue-05 rounded-lg'
          onClick={() => setIsOpened(!isOpened)}
        >
          <span className='text-blue-10'>{CATEGORY_LABEL[selectedCategory]}</span>
          <FiChevronDown
            size={22}
            className={`text-grey-20 ${isOpened ? 'rotate-180' : 'rotate-0'} transition-transform duration-300`}
          />
        </button>

        {isOpened && (
          <div className='mx-1 border-x-1 border-b-1 md:border-x-2 md:border-b-2 border-blue-05 rounded-b-lg bg-white'>
            {options.map((option) => (
              <div
                className='flex py-2 px-4 text-grey-40 cursor-pointer hover:bg-blue-01'
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
        className='flex-1 px-4 md:px-0 py-2 border-1 md:border-2 border-blue-05 rounded-lg cursor-text'
        onClick={handleFocusEditor}
      >
        <div className='px-4 py-2 md:px-0 overflow-visible' ref={editorWrapperRef}>
          <BlockTextEditor onEditorReady={handleEditorReady} domain={DOMAIN_VALUES[0]} />
        </div>
      </div>

      {/* 완료 버튼 */}
      <div className='flex justify-end'>
        <button
          className='w-24 md:w-46 bg-grey-10 cursor-pointer p-2 md:p-3 rounded-xl disabled:opacity-50'
          onClick={handleUploadPost}
          disabled={isLoading}
        >
          <p className='text-black text-body02'>완료</p>
        </button>
      </div>
    </div>
  );
}
