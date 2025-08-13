import ProfileImage from '../../../atoms/ImageViewer';
import Button from '../../../atoms/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../store/useAuthStore';
import { getDepartmentLabel } from '../../../../utils/department';

const ProfileCard = () => {
  const user = useAuthStore((state) => state.user);
  const userDepartmentValue = user?.departmentName || '';
  const departmentLabel = getDepartmentLabel(userDepartmentValue);

  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className='bg-white h-48 md:h-[242px] flex justify-center items-center rounded-2xl'>
      <ProfileImage imageUrl={user.profileImageUrl} className='w-36 h-36 md:w-48 md:h-48' />
      <div id='contentbox' className='flex flex-col mb-4 gap-4 mt-1 ml-2 md:ml-8'>
        <div className='w-40 md:w-78 flex flex-col border-2 border-grey-05 md:px-4.5 md:py-4 rounded-xl px-2 py-2'>
          <p className='text-lg md:text-3xl font-medium'>{user.nickname}</p>
          <div className='w-full flex gap-2 text-xs md:text-base'>
            <p className='text-black'>{departmentLabel}</p>
            <p className='text-grey-40'>|</p>
            <p className='text-black '>{user.studentNumber}</p>
          </div>
          <p className='text-grey-40 text-xs md:text-base'>{user.email}</p>
        </div>
        <div className='hidden md:block'>
          <Button
            variant='blue35'
            size='lg'
            disabled={false}
            fullWidth={true}
            shape='rounded'
            onClick={() => navigate(`/mypage/${user.uuid}/edit`)}
          >
            프로필 수정
          </Button>
        </div>
        <div className='block md:hidden'>
          <Button
            variant='blue35'
            size='md'
            disabled={false}
            fullWidth={true}
            shape='rounded'
            onClick={() => navigate(`/mypage/${user.uuid}/edit`)}
          >
            프로필 수정
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
