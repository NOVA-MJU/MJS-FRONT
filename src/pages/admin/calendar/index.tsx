import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Divider from '../../../components/atoms/Divider';
import CalendarGrid, { type CalendarEventItem } from '../../../components/organisms/CalendarGrid';
import CalendarList from '../../../components/organisms/CalendarList';
import clsx from 'clsx';
import { IoIosClose } from 'react-icons/io';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import BlockTextEditor from '../../../components/organisms/BlockTextEditor';
import { BlockNoteEditor } from '@blocknote/core';
import { DOMAIN_VALUES } from '../../../api/s3upload';
import GlobalErrorPage from '../../error';
import Button from '../../../components/atoms/Button';
import DatePicker from '../../../components/organisms/DatePicker';
import { postDepartmentSchedule } from '../../../api/admin';

const CALENDAR_COLORS = ['#6898DE', '#DE6898', '#DEAE68', '#98DE68', '#68D3DE', '#7368DE'];

/**
 * 관리자 학과 일정 관리 페이지
 *
 * 학과 관리자가 학과 일정을 조회하고 추가할 수 있는 페이지입니다.
 * 캘린더 그리드와 일정 목록을 표시하며, 새로운 일정을 작성할 수 있습니다.
 */
export default function Admin() {
  const { departmentUuid } = useParams<{ departmentUuid: string }>();
  const [, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [isOpened, setIsOpened] = useState(false);
  const editorRef = useRef<BlockNoteEditor | null>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  /**
   * 페이지 로드 함수
   */
  const loadSchedules = useCallback(async () => {
    if (!departmentUuid) return;
    try {
      setEvents([]);
    } catch (e) {
      console.error(e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [departmentUuid]);

  /**
   * uuid에 따라 학과별 페이지를 로드합니다
   */
  useEffect(() => {
    (async () => {
      await loadSchedules();
    })();
  }, [loadSchedules]);

  /**
   * 새로운 일정 추가 핸들러
   */
  const handleSubmitEvent = async () => {
    if (isLoading || !departmentUuid) return;
    if (!newTitle) return alert('이벤트 제목을 입력하세요');
    if (!newColor) return alert('이벤트 색상을 지정하세요');
    if (!newStartDate || !newEndDate) return alert('이벤트 날짜를 지정하세요');
    if (editorRef.current?.isEmpty) return alert('이벤트 본문을 입력하세요');
    try {
      setIsLoading(true);
      const newContent = JSON.stringify(editorRef.current?.document);
      await postDepartmentSchedule(
        departmentUuid,
        generateUUID(),
        newTitle,
        newContent,
        newColor,
        newStartDate,
        newEndDate,
      );
      await loadSchedules();
      setNewTitle('');
      setNewColor('');
      setNewStartDate('');
      setNewEndDate('');
      setIsOpened(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 에디터 인스턴스를 불러옵니다.
   */
  const handleEditorReady = useCallback((editor: BlockNoteEditor) => {
    editorRef.current = editor;
  }, []);

  /**
   * 에러 페이지
   */
  if (isError) return <GlobalErrorPage />;

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
    <div className='flex w-full flex-1 flex-col gap-6 px-7 py-12'>
      <p className='text-heading01 text-mju-primary'>학과일정 관리</p>
      <Divider />
      <div className='flex flex-col gap-6 md:flex-row'>
        <div className='w-full md:w-2/3'>
          <CalendarGrid
            events={events}
            onYearChange={setCurrentYear}
            onMonthChange={setCurrentMonth}
          />
        </div>
        <div className='w-full md:w-1/3'>
          <CalendarList
            events={events}
            month={currentMonth}
            administrator
            handleAddEvent={() => setIsOpened((p) => !p)}
          />
        </div>
      </div>
      {/**
       * 일정 추가 모달
       */}
      {isOpened && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#0008] p-10'>
          <div className='h-fit max-h-[calc(100vh-5rem)] w-full max-w-128 overflow-y-auto rounded-lg bg-white'>
            <div className='flex flex-col gap-6 p-6'>
              <div className='flex items-center justify-between'>
                <button className='cursor-pointer' onClick={() => setIsOpened((p) => !p)}>
                  <p className='text-heading02'>
                    <IoIosClose />
                  </p>
                </button>
                <Button variant='blue35' shape='rounded' onClick={handleSubmitEvent}>
                  완료
                </Button>
              </div>
              <div className='flex flex-col gap-3'>
                <p className='text-title02 text-mju-primary'>학과일정</p>
                <div className='flex gap-3'>
                  {CALENDAR_COLORS.map((color) => (
                    <button
                      key={color}
                      style={{ backgroundColor: color }}
                      className={clsx(
                        'h-5 w-5 cursor-pointer rounded-full',
                        color === newColor && 'border-mju-primary border-2',
                      )}
                      onClick={() => setNewColor(color)}
                    />
                  ))}
                </div>
                <input
                  className='border-blue-05 placeholder:text-grey-20 h-fit w-full rounded-lg border-2 bg-transparent p-3 outline-none placeholder:text-[16px]'
                  placeholder='학과일정을 입력하세요'
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className='flex flex-col gap-3'>
                <p className='text-title02 text-mju-primary'>날짜</p>
                <div className='flex gap-4'>
                  <button className='border-blue-05 w-full rounded-lg border-2 p-2'>
                    <p className={clsx('text-body02', !newStartDate && 'text-grey-20')}>
                      {newStartDate || '시작일'}
                    </p>
                  </button>
                  <button className='border-blue-05 w-full rounded-lg border-2 p-2'>
                    <p className={clsx('text-body02', !newEndDate && 'text-grey-20')}>
                      {newEndDate || '종료일'}
                    </p>
                  </button>
                </div>
                <DatePicker onStartDateChange={setNewStartDate} onEndDateChange={setNewEndDate} />
              </div>
              <div className='flex flex-col gap-3'>
                <p className='text-title02 text-mju-primary'>내용</p>
                <div
                  className='border-blue-05 min-h-48 cursor-text rounded-lg border-2 p-4'
                  onClick={handleFocusEditor}
                >
                  <div ref={editorWrapperRef}>
                    <BlockTextEditor onEditorReady={handleEditorReady} domain={DOMAIN_VALUES[3]} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 삭제예정
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
