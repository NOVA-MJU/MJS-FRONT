import ProfileImage from '../../../atoms/ImageViewer';
import Button from '../../../atoms/Button';

const ProfileCard = () => {
  return (
    <div className='bg-white w-full h-[242px] flex justify-center items-center rounded-2xl'>
      <ProfileImage imageUrl={undefined} width='194px' height='194px' />
      <div id='contentbox' className='flex flex-col mb-4 gap-4 mt-1 ml-8'>
        <div className='w-78 flex flex-col border-2 border-grey-05 px-4.5 py-4 rounded-xl'>
          <p className='text-3xl font-medium'>홍길동</p>
          <div className='w-24 flex justify-between'>
            <p className='text-black'>학과명</p>
            <p className='text-grey-40'>|</p>
            <p className='text-black'>학번</p>
          </div>
          <p className='text-grey-40'>abc123@mju.ac.kr</p>
        </div>
        <Button variant='blue35' size='lg' disabled={false} fullWidth={true} shape='rounded'>
          프로필 수정
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
