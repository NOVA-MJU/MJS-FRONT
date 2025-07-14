import clsx from 'clsx';
import { Typography } from '../../atoms/Typography';

type CalendarGridItemProps = {
  day: number;
  outdated?: boolean;
  focused?: boolean;
  weekend?: boolean;
};
export default function CalendarGridItem({
  day,
  outdated = false,
  focused = false,
  weekend = false,
}: CalendarGridItemProps) {
  return (
    <div
      className={clsx(
        'h-40 p-3 flex flex-col gap-3',
        outdated && 'text-grey-40',
        focused && 'text-blue-35',
        weekend && 'text-error',
      )}
    >
      <Typography variant='body02'>{day}</Typography>
      <hr
        className={clsx('h-[2px] rounded-full border-0', focused ? 'bg-blue-10' : 'bg-grey-05')}
      />
    </div>
  );
}
