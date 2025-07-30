import clsx from 'clsx';
import { Typography } from '../../atoms/Typography';

interface Event {
  event: string;
}

interface CalendarGridItemProps {
  day: number;
  outdated?: boolean;
  focused?: boolean;
  weekend?: boolean;
  events?: Event[];
}

export default function CalendarGridItem({
  day,
  outdated = false,
  focused = false,
  weekend = false,
  events,
}: CalendarGridItemProps) {
  return (
    <div
      className={clsx(
        'w-full h-40 flex flex-col gap-3',
        outdated && 'text-grey-40',
        focused && 'text-blue-35',
        weekend && 'text-error',
      )}
    >
      <Typography variant='body02' className='mx-3 mt-3'>
        {String(day).padStart(2, '0')}
      </Typography>
      <hr
        className={clsx(
          'mx-3 h-[2px] rounded-full border-0',
          focused ? 'bg-blue-10' : 'bg-grey-05',
        )}
      />
      {events?.map((event) => <CalendarEventRibbon event={event.event} />)}
    </div>
  );
}

interface CalendarEventRibbonProps {
  event?: string;
}

function CalendarEventRibbon({ event }: CalendarEventRibbonProps) {
  return (
    <div className={`h-6 px-3 bg-blue-10`}>
      <Typography variant='caption01' className='text-white'>
        {event}
      </Typography>
    </div>
  );
}
