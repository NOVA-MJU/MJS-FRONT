import { IoIosArrowDown } from 'react-icons/io';
import { Typography } from '../../atoms/Typography';
import { useState } from 'react';
import clsx from 'clsx';

export interface CalendarListItemProps {
  uuid: string;
  description: string;
  startDate: string;
  endDate: string;
  deleteMode?: boolean;
  handleSelectDelete?: () => void;
}

export default function CalendarListItem({
  description,
  startDate,
  endDate,
  deleteMode = false,
  handleSelectDelete,
}: CalendarListItemProps) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <div
        className={clsx('flex items-center gap-3 px-2 py-1', isOpened && 'bg-blue-05 rounded-lg')}
      >
        {deleteMode && <input type='checkbox' onChange={handleSelectDelete} className='mr-2' />}
        <div className='flex flex-1 flex-col gap-1'>
          <Typography variant='title02' className='text-blue-35'>
            {description}
          </Typography>
          <Typography variant='body03' className='text-grey-40'>
            {`${startDate} ~ ${endDate}`}
          </Typography>
        </div>
        {deleteMode || (
          <button
            className='text-blue-10 cursor-pointer text-xl'
            onClick={() => setIsOpened((prev) => !prev)}
          >
            <IoIosArrowDown />
          </button>
        )}
      </div>
      {isOpened && (
        <div className='border-grey-05 h-fit w-full rounded-lg border-1 px-3 py-2'>
          <Typography variant='body03' className='text-grey-40'>
            {description}
          </Typography>
        </div>
      )}
    </>
  );
}
