import { IoIosArrowDown } from 'react-icons/io';
import { Typography } from '../../atoms/Typography';

interface DepartmentNoticeItemProps {
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
  return (
    <div className='flex gap-3 cursor-pointer items-center'>
      {imageUrl && (
        <img src={imageUrl} alt='썸네일' className='w-42 h-32 rounded-xl object-cover' />
      )}
      <div className='flex-1 p-3 flex flex-col gap-3'>
        <Typography variant='title02' className='text-blue-35'>
          {title}
        </Typography>
        <Typography variant='body03' className='text-black'>
          {content}
        </Typography>
        <Typography variant='body03' className='text-grey-40'>
          {date}
        </Typography>
      </div>
      <IoIosArrowDown className='text-blue-10 text-xl' />
    </div>
  );
}
