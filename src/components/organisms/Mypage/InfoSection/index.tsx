import LabelButton from '../../../atoms/Button/LabelButton';

const InfoSection: React.FC = () => {
  return (
    <div className='w-full md:w-[600px]'>
      <p className='text-mju-primary text-xl md:text-3xl font-bold mb-6'>정보</p>
      <div className='min-h-32 flex flex-col justify-center bg-white rounded-2xl p-8 gap-8 '>
        <LabelButton label='커뮤니티 이용 규칙' />
        <hr className='text-grey-10 border-1' />
        <LabelButton label='서비스 이용 약관' />
        <hr className='text-grey-10 border-1' />
        <LabelButton label='개인정보 처리 방침' />
      </div>
    </div>
  );
};

export default InfoSection;
