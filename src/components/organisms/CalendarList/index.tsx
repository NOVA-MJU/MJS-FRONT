import Divider from '../../atoms/Divider';
import { Typography } from '../../atoms/Typography';
import CalendarListItem, { type CalendarListItemProps } from '../../molecules/CalendarListItem';

interface CalendarListProps {
  events: CalendarListItemProps[] | null;
  month: number;
}

export default function CalendarList({ events, month }: CalendarListProps) {
  const filteredEvents = getFilteredCalendarList(events, month);

  return (
    <div className='w-full h-fit px-6 py-4 gap-2 flex flex-col border-2 border-grey-05 rounded-xl'>
      <Typography variant='title02' className='text-mju-primary'>
        전체 학사일정
      </Typography>
      <Divider variant='thin' />
      {filteredEvents?.map((event) => (
        <CalendarListItem
          description={event.description}
          startDate={event.startDate}
          endDate={event.endDate}
        />
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
