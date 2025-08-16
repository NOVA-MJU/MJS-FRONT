import { useState } from 'react';
import Divider from '../../atoms/Divider';
import { Typography } from '../../atoms/Typography';
import CalendarListItem, { type CalendarListItemProps } from '../../molecules/CalendarListItem';

interface CalendarListProps {
  events: CalendarListItemProps[] | null;
  month: number;
  administrator?: boolean;
  handleAddEvent?: () => void;
}

export default function CalendarList({
  events,
  month,
  administrator = false,
  handleAddEvent,
}: CalendarListProps) {
  const filteredEvents = getFilteredCalendarList(events, month);
  const [deleteMode, setDeleteMode] = useState(false);

  return (
    <div className='w-full h-fit px-6 py-4 gap-2 flex flex-col border-2 border-grey-05 rounded-xl'>
      <Typography variant='title02' className='text-mju-primary'>
        전체 학사일정
      </Typography>
      <Divider variant='thin' />
      {filteredEvents?.map((event, index) => (
        <CalendarListItem
          key={index}
          description={event.description}
          startDate={event.startDate}
          endDate={event.endDate}
          deleteMode={deleteMode}
        />
      ))}
      {filteredEvents.length === 0 && (
        <div className='p-4 flex justify-center items-center'>
          <Typography variant='body02'>등록된 일정이 없습니다</Typography>
        </div>
      )}
      {administrator &&
        (!deleteMode ? (
          <>
            <button
              className='w-full h-fit p-3 bg-blue-35 rounded-xl cursor-pointer'
              onClick={handleAddEvent}
            >
              <Typography variant='body02' className='text-white'>
                일정 추가
              </Typography>
            </button>
            <button
              className='w-full h-fit p-3 bg-grey-10 rounded-xl cursor-pointer'
              onClick={() => setDeleteMode((p) => !p)}
            >
              <Typography variant='body02' className='text-error'>
                일정 삭제
              </Typography>
            </button>
          </>
        ) : (
          <>
            <button
              className='w-full h-fit p-3 bg-grey-10 rounded-xl cursor-pointer'
              onClick={() => setDeleteMode((p) => !p)}
            >
              <Typography variant='body02' className='text-blue-35'>
                취소
              </Typography>
            </button>
            <button className='w-full h-fit p-3 bg-error rounded-xl cursor-pointer'>
              <Typography variant='body02' className='text-white'>
                삭제
              </Typography>
            </button>
          </>
        ))}
    </div>
  );
}

function getFilteredCalendarList(
  events: CalendarListItemProps[] | null,
  month: number,
): CalendarListItemProps[] {
  if (!events) return [];
  const pad = (n: number) => String(n).padStart(2, '0');
  return events
    .filter((e) => new Date(e.startDate).getMonth() + 1 === month)
    .map((e) => {
      const s = new Date(e.startDate);
      const t = new Date(e.endDate);
      return {
        description: e.description,
        startDate: `${pad(s.getMonth() + 1)}.${pad(s.getDate())}`,
        endDate: `${pad(t.getMonth() + 1)}.${pad(t.getDate())}`,
      };
    });
}
