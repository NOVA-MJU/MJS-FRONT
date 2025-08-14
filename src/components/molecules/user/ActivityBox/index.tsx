import { Link } from 'react-router-dom';
import LabelButton from '../../../atoms/Button/LabelButton';

interface ActivityBoxProps {
  label: string;
  count: number;
  link: string;
}

const ActivityBox = ({ label, count, link }: ActivityBoxProps) => {
  return (
    <div className='w-26 h-26 md:w-48 md:h-28 bg-white flex flex-col justify-center items-start rounded-2xl px-3 md:px-6 py-2 md:py-4'>
      <Link to={link} className='text-[#17171b] hover:underline'>
        <LabelButton emphasized={true} label={label ?? ''} />
      </Link>
      <p className='text-grey-40 text-sm md:text-3xl font-bold mt-2'>{count}</p>
    </div>
  );
};

export default ActivityBox;
