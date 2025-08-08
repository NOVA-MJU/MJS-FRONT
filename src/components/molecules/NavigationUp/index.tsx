import { IoIosArrowBack } from 'react-icons/io';
import { Typography } from '../../atoms/Typography';

interface NavigationUpProps {
  onClick: () => void;
}

export default function NavigationUp({ onClick }: NavigationUpProps) {
  return (
    <button
      className='w-fit h-fit p-3 rounded-xl flex gap-3 items-center cursor-pointer duration-200 hover:bg-grey-05'
      onClick={onClick}
    >
      <IoIosArrowBack className='text-lg text-blue-10' />
      <Typography variant='body03' className='text-blue-10'>
        이전
      </Typography>
    </button>
  );
}
