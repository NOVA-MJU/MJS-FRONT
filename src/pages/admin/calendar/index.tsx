import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '../../../components/atoms/Typography';
import Divider from '../../../components/atoms/Divider';
import CalendarGrid from '../../../components/organisms/CalendarGrid';
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

const CALENDAR_COLORS = ['#6898DE', '#DE6898', '#DEAE68', '#98DE68', '#68D3DE', '#7368DE'];

export default function Admin() {
  const { departmentUuid } = useParams<{ departmentUuid: string }>();
  const [eventsGrid] = useState([]);
  const [eventsList] = useState(xlist);
  const [, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [isOpened, setIsOpened] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const editorRef = useRef<BlockNoteEditor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');

  /**
   * uuid에 따라 학과별 페이지를 로드합니다
   */
  useEffect(() => {
    (async () => {
      try {
        console.log();
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
    if (isLoading) return;
    setIsLoading(true);
    try {
      console.log();
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
            events={eventsGrid}
            onYearChange={setCurrentYear}
            onMonthChange={setCurrentMonth}
          />
        </div>
        <div className='flex-1/3'>
          <CalendarList
            events={eventsList}
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
                      className={clsx(
                        `w-5 h-5 rounded-full cursor-pointer bg-[${color}]`,
                        color === selectedColor && 'border-2 border-mju-primary',
                      )}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
                <input
                  className='w-full h-fit p-3 outline-none rounded-lg border-2 border-blue-05 bg-transparent placeholder:text-grey-20 placeholder:text-[16px]'
                  placeholder='학과일정을 입력하세요'
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                />
              </div>
              <div className='flex flex-col gap-3'>
                <Typography variant='title02' className='text-mju-primary'>
                  날짜
                </Typography>
                <input
                  className='w-full h-fit p-3 outline-none rounded-lg border-2 border-blue-05 bg-transparent placeholder:text-grey-20 placeholder:text-[16px]'
                  placeholder='시작일'
                />
              </div>
              <div className='flex flex-col gap-3'>
                <Typography variant='title02' className='text-mju-primary'>
                  내용
                </Typography>
                <div className='border-2 rounded-lg border-blue-05'>
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

const xlist = [
  {
    description: '일정1',
    startDate: '2025-08-08',
    endDate: '2025-09-08',
  },
  {
    description: '일정2',
    startDate: '2025-08-08',
    endDate: '2025-08-08',
  },
  {
    description: '일정3',
    startDate: '2025-08-08',
    endDate: '2025-08-08',
  },
];
