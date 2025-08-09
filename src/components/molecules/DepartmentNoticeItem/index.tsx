import { IoIosArrowDown } from 'react-icons/io';
import { Typography } from '../../atoms/Typography';
import { useState } from 'react';
import clsx from 'clsx';

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
        className='flex gap-3 cursor-pointer items-center hover:bg-blue-05 rounded-lg'
        onClick={() => setIsOpened((prev) => !prev)}
      >
        {imageUrl && (
          <img src={imageUrl} alt='썸네일' className='w-42 h-32 rounded-lg object-cover' />
        )}
        <div className='flex-1 p-3 flex flex-col gap-3'>
          <Typography variant='title02' className='text-blue-35'>
            {title}
          </Typography>
          <Typography variant='body03' className='text-black'>
            {content}
          </Typography>
          <Typography variant='body03' className='text-grey-40'>
            {formatDateDot(date)}
          </Typography>
        </div>
        <IoIosArrowDown className={clsx('text-blue-10 text-xl', isOpened && 'rotate-180')} />
      </div>
      {isOpened && (
        <div className='w-full h-fit p-6 flex flex-col gap-6 border-1 border-grey-05 rounded-lg'>
          <img src={imageUrl} alt='공지사항 이미지' className='max-w-96 rounded-lg' />
          <Typography variant='body03' className='text-black'>
            {content}
          </Typography>
        </div>
      )}
    </>
  );
}

function formatDateDot(dateTime: string): string {
  const [date] = dateTime.split('T');
  const [yyyy, mm, dd] = date.split('-');
  return `${yyyy}.${mm}.${dd}`;
}
