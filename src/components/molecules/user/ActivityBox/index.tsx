import LabelButton from '../../../atoms/Button/LabelButton';
interface ActivityBoxProps {
  label: string;
}

const ActivityBox = ({ label }: ActivityBoxProps) => {
  return (
    <div className='w-48 h-28 bg-white flex flex-col justify-center items-start rounded-2xl px-6 py-4'>
      <LabelButton emphasized={true} label={label ?? ''} />
      <p className='text-grey-40 text-3xl font-bold mt-2'>00 개</p>
    </div>
  );
};

export default ActivityBox;
