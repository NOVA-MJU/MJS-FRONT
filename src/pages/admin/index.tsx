/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '../../components/atoms/Typography';
import Divider from '../../components/atoms/Divider';
import CalendarGrid from '../../components/organisms/CalendarGrid';
import CalendarList from '../../components/organisms/CalendarList';
import MarkdownEditor from '../../components/organisms/MarkdownEditor';
import clsx from 'clsx';
import { IoIosClose } from 'react-icons/io';

export default function Admin() {
  const { uuid } = useParams<{ uuid: string }>();
  const [eventsGrid, setEventsGrid] = useState(xgrid);
  const [eventsList, setEventsList] = useState(xlist);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [isOpened, setIsOpened] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventStartDate, setNewEventStartDate] = useState('');
  const [newEventEndDate, setNewEventEndDate] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');

  /**
   * uuid에 따라 학과별 페이지를 로드합니다
   */
  useEffect(() => {}, [uuid]);

  async function handleSubmitEvent() {}

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
                <button
                  className={clsx(
                    'w-46 h-12 rounded-lg',
                    isFinished ? 'bg-blue-35 cursor-pointer' : 'bg-grey-20',
                  )}
                  onClick={handleSubmitEvent}
                >
                  <Typography variant='body03' className='text-white'>
                    완료
                  </Typography>
                </button>
              </div>
              <div className='flex flex-col gap-3'>
                <Typography variant='title02' className='text-mju-primary'>
                  학과일정
                </Typography>
                <div className='flex gap-3'>
                  {colors.map((color) => (
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
                <Input placeholder='학과일정을 입력하세요' />
              </div>

              <div className='flex flex-col gap-3'>
                <Typography variant='title02' className='text-mju-primary'>
                  날짜
                </Typography>
                <Input placeholder='시작일' />
              </div>

              <div className='flex flex-col gap-3'>
                <Typography variant='title02' className='text-mju-primary'>
                  내용
                </Typography>
                <MarkdownEditor
                  onContentChanged={function (content: string): void {
                    throw new Error('Function not implemented.');
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ placeholder = '' }) {
  return (
    <input
      className='w-full h-fit p-3 outline-none rounded-lg border-2 border-blue-05 bg-transparent placeholder:text-grey-20 placeholder:text-[16px]'
      placeholder={placeholder}
    />
  );
}

const colors = ['#6898DE', '#DE6898', '#DEAE68', '#98DE68', '#68D3DE', '#7368DE'];

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
