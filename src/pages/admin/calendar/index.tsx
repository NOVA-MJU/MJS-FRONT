import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '../../../components/atoms/Typography';
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
import { getDepartmentSchedules } from '../../../api/departments';
import DatePicker from '../../../components/organisms/DatePicker';
import { postDepartmentSchedule } from '../../../api/admin';

const CALENDAR_COLORS = ['#6898DE', '#DE6898', '#DEAE68', '#98DE68', '#68D3DE', '#7368DE'];

export default function Admin() {
  const { departmentUuid } = useParams<{ departmentUuid: string }>();
  const [, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [isOpened, setIsOpened] = useState(false);
  const editorRef = useRef<BlockNoteEditor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  /**
   * uuid에 따라 학과별 페이지를 로드합니다
   */
  useEffect(() => {
    (async () => {
      if (!departmentUuid) return;
      try {
        const res = await getDepartmentSchedules(departmentUuid);
        setEvents(
          res.schedules.map(({ title, startDateTime, endDateTime }) => ({
            year: new Date(startDateTime).getFullYear(),
            startDate: startDateTime.slice(0, 10),
            endDate: endDateTime.slice(0, 10),
            description: title,
          })),
        );
      } catch (e) {
        console.error(e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [departmentUuid]);

  /**
   * 새로운 일정 추가 핸들러
   */
  const handleSubmitEvent = async () => {
    if (isLoading || !departmentUuid) return;
    if (!newTitle) return alert('이벤트 제목을 입력하세요');
    if (!newColor) return alert('이벤트 색상을 지정하세요');
    if (!newStartDate || !newEndDate) return alert('이벤트 날짜를 지정하세요');
    if (editorRef.current?.isEmpty) return alert('이벤트 본문을 입력하세요');
    setIsLoading(true);
    try {
      const newContent = JSON.stringify(editorRef.current?.document);
      console.log('title\n', newTitle);
      console.log('content\n', newContent);
      console.log('colorCode\n', newColor);
      console.log('startDate\n', newStartDate);
      console.log('endDate\n', newEndDate);
      const res = await postDepartmentSchedule(
        departmentUuid,
        generateUUID(),
        newTitle,
        newContent,
        newColor,
        newStartDate,
        newEndDate,
      );
      console.log(res);
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

  if (isError) return <GlobalErrorPage />;

  return (
    <div className='w-full flex-1 px-7 py-12 flex flex-col gap-6'>
      <Typography variant='heading01' className='text-mju-primary'>
        학과일정 관리
      </Typography>
      <Divider />
      <div className='flex gap-6'>
        <div className='flex-2/3'>
          <CalendarGrid
            events={events}
            onYearChange={setCurrentYear}
            onMonthChange={setCurrentMonth}
          />
        </div>
        <div className='flex-1/3'>
          <CalendarList
            events={events}
            month={currentMonth}
            administrator
            handleAddEvent={() => setIsOpened((p) => !p)}
            handleDeleteEvent={() => null}
          />
        </div>
      </div>
      {/**
       * 일정 추가 모달
       */}
      {isOpened && (
        <div className='fixed inset-0 z-50 p-10 flex items-center justify-center bg-[#0008]'>
          <div className='bg-white rounded-lg w-full h-fit'>
            <div className='p-6 flex flex-col gap-6'>
              <div className='flex justify-between items-center'>
                <button className='cursor-pointer' onClick={() => setIsOpened((p) => !p)}>
                  <Typography variant='heading02'>
                    <IoIosClose />
                  </Typography>
                </button>
                <Button variant='blue35' shape='rounded' onClick={handleSubmitEvent}>
                  완료
                </Button>
              </div>
              <div className='flex flex-col gap-3'>
                <Typography variant='title02' className='text-mju-primary'>
                  학과일정
                </Typography>
                <div className='flex gap-3'>
                  {CALENDAR_COLORS.map((color) => (
                    <button
                      key={color}
                      style={{ backgroundColor: color }}
                      className={clsx(
                        'w-5 h-5 rounded-full cursor-pointer',
                        color === newColor && 'border-2 border-mju-primary',
                      )}
                      onClick={() => setNewColor(color)}
                    />
                  ))}
                </div>
                <input
                  className='w-full h-fit p-3 outline-none rounded-lg border-2 border-blue-05 bg-transparent placeholder:text-grey-20 placeholder:text-[16px]'
                  placeholder='학과일정을 입력하세요'
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className='flex flex-col gap-3'>
                <Typography variant='title02' className='text-mju-primary'>
                  날짜
                </Typography>
                <div className='flex gap-4'>
                  <button className='w-full p-2 rounded-lg border-2 border-blue-05 '>
                    <Typography variant='body02' className={clsx(!newStartDate && 'text-grey-20')}>
                      {newStartDate || '시작일'}
                    </Typography>
                  </button>
                  <button className='w-full p-2 rounded-lg border-2 border-blue-05'>
                    <Typography variant='body02' className={clsx(!newEndDate && 'text-grey-20')}>
                      {newEndDate || '종료일'}
                    </Typography>
                  </button>
                </div>
                <DatePicker onStartDateChange={setNewStartDate} onEndDateChange={setNewEndDate} />
              </div>
              <div className='flex flex-col gap-3'>
                <Typography variant='title02' className='text-mju-primary'>
                  내용
                </Typography>
                <div className='min-h-48 p-4  border-2 rounded-lg border-blue-05'>
                  <BlockTextEditor onEditorReady={handleEditorReady} domain={DOMAIN_VALUES[3]} />
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
