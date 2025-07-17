import ActivityBox from '../../../molecules/user/ActivityBox';

const ActivitiesSection: React.FC = () => {
  return (
    <div>
      <p className='w-[600px] text-mju-primary text-3xl font-bold m-auto mb-6'>나의 활동</p>
      <div className='flex gap-4'>
        <ActivityBox label={'내가 쓴 게시물'} />
        <ActivityBox label={'내가 쓴 댓글'} />
        <ActivityBox label={'찜한 글'} />
      </div>
    </div>
  );
};
export default ActivitiesSection;
