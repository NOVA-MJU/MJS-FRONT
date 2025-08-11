import { Link } from 'react-router-dom';
import { Typography } from '../../../atoms/Typography';
import { IoIosArrowForward } from 'react-icons/io';

interface ActivityBoxProps {
  label: string;
  count: number;
  link: string;
}

const ActivityBox = ({ label, count, link }: ActivityBoxProps) => {
  return (
    <Link
      to={link}
      className='w-48 h-28 bg-white flex flex-col justify-center items-start rounded-2xl px-6 py-4 gap-2'
    >
      <Typography
        variant='title01'
        className='w-full text-mju-primary flex justify-between items-center'
      >
        {label}
        <IoIosArrowForward className='text-blue-10' />
      </Typography>
      <Typography variant='heading02' className='text-grey-40'>
        {`${count}개`}
      </Typography>
    </Link>
  );
};

export default ActivityBox;
