import { useState } from 'react';
import Divider from '../../atoms/Divider';
import { Typography } from '../../atoms/Typography';
import CalendarListItem, { type CalendarListItemProps } from './calendar-list-item';

interface CalendarListProps {
  events: CalendarListItemProps[] | null;
  month: number;
  administrator?: boolean;
  handleAddEvent?: () => void;
}

/**
 * @deprecated
 * @param param0
 * @returns
 */
export default function CalendarList({
  events,
  month,
  administrator = false,
  handleAddEvent,
}: CalendarListProps) {
  const filteredEvents = getFilteredCalendarList(events, month);
  const [deleteMode, setDeleteMode] = useState(false);

  return (
    <div className='border-grey-05 flex h-fit w-full flex-col gap-2 rounded-xl border-2 px-6 py-4'>
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
        <div className='flex items-center justify-center p-4'>
          <Typography variant='body02'>등록된 일정이 없습니다</Typography>
        </div>
      )}
      {administrator &&
        (!deleteMode ? (
          <>
            <button
              className='bg-blue-35 h-fit w-full cursor-pointer rounded-xl p-3'
              onClick={handleAddEvent}
            >
              <Typography variant='body02' className='text-white'>
                일정 추가
              </Typography>
            </button>
            <button
              className='bg-grey-10 h-fit w-full cursor-pointer rounded-xl p-3'
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
              className='bg-grey-10 h-fit w-full cursor-pointer rounded-xl p-3'
              onClick={() => setDeleteMode((p) => !p)}
            >
              <Typography variant='body02' className='text-blue-35'>
                취소
              </Typography>
            </button>
            <button className='bg-error h-fit w-full cursor-pointer rounded-xl p-3'>
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
