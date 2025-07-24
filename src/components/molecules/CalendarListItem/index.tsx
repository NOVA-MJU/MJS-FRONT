import { IoIosArrowDown } from 'react-icons/io';
import { Typography } from '../../atoms/Typography';

export default function CalendarListItem() {
  return (
    <div className='flex px-2 py-1 gap-3'>
      <div className='flex-1 flex flex-col gap-1'>
        <Typography variant='title02' className='text-blue-35'>
          학사일정01
        </Typography>
        <Typography variant='body03' className='text-grey-40'>
          07.06 ~ 07.10
        </Typography>
      </div>
      <button className='cursor-pointer text-xl text-blue-10'>
        <IoIosArrowDown />
      </button>
    </div>
  );
}
