import { IoIosArrowDown } from 'react-icons/io';
import { Typography } from '../../atoms/Typography';

export interface CalendarListItemProps {
  description: string;
  startDate: string;
  endDate: string;
}

export default function CalendarListItem({
  description,
  startDate,
  endDate,
}: CalendarListItemProps) {
  return (
    <div className='flex px-2 py-1 gap-3'>
      <div className='flex-1 flex flex-col gap-1'>
        <Typography variant='title02' className='text-blue-35'>
          {description}
        </Typography>
        <Typography variant='body03' className='text-grey-40'>
          {`${startDate} ~ ${endDate}`}
        </Typography>
      </div>
      <button className='cursor-pointer text-xl text-blue-10'>
        <IoIosArrowDown />
      </button>
    </div>
  );
}
