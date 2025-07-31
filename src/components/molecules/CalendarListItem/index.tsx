import { IoIosArrowDown } from 'react-icons/io';
import { Typography } from '../../atoms/Typography';
import { useState } from 'react';
import clsx from 'clsx';

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
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <div className={clsx('flex px-2 py-1 gap-3', isOpened && 'rounded-lg bg-blue-05')}>
        <div className='flex-1 flex flex-col gap-1'>
          <Typography variant='title02' className='text-blue-35'>
            {description}
          </Typography>
          <Typography variant='body03' className='text-grey-40'>
            {`${startDate} ~ ${endDate}`}
          </Typography>
        </div>
        <button
          className='cursor-pointer text-xl text-blue-10'
          onClick={() => setIsOpened((prev) => !prev)}
        >
          <IoIosArrowDown />
        </button>
      </div>
      {isOpened && (
        <div className='w-full h-fit px-3 py-2 rounded-lg border-1 border-grey-05'>
          <Typography variant='body03' className='text-grey-40'>
            {description}
          </Typography>
        </div>
      )}
    </>
  );
}
