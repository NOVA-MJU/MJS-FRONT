import { IoIosArrowDown } from 'react-icons/io';
import { Typography } from '../../atoms/Typography';
import { useState } from 'react';
import clsx from 'clsx';
import { formatToElapsedTime } from '../../../utils';
import BlockTextEditor from '../../organisms/BlockTextEditor';

export interface DepartmentNoticeItemProps {
  imageUrl?: string;
  title: string;
  content: string;
  date: string;
}

export default function DepartmentNoticeItem({
  imageUrl,
  title,
  content,
  date,
}: DepartmentNoticeItemProps) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <div
        className='flex gap-1 md:gap-3 cursor-pointer items-center hover:bg-blue-05 rounded-lg'
        onClick={() => setIsOpened((prev) => !prev)}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt='썸네일'
            className='w-24 h-20 md:w-42 md:h-32 rounded-lg object-cover'
          />
        )}
        <div className='flex-1 p-2 md:p-3 flex flex-col gap-0.5 md:gap-3'>
          <Typography variant='title02' className='text-blue-35 line-clamp-1'>
            {title}
          </Typography>
          <Typography variant='body03' className='text-black line-clamp-2 break-all'>
            {content}
          </Typography>
          <Typography variant='body03' className='text-grey-40'>
            {formatToElapsedTime(date)}
          </Typography>
        </div>
        <IoIosArrowDown className={clsx('text-blue-10 text-xl', isOpened && 'rotate-180')} />
      </div>
      {isOpened && (
        <div className='w-full h-fit p-6 flex flex-col gap-6 border-1 border-grey-05 rounded-lg'>
          <BlockTextEditor readOnly initialContent={content} />
        </div>
      )}
    </>
  );
}
