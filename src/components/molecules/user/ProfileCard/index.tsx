import ProfileImage from '../../../atoms/ImageViewer';
import Button from '../../../atoms/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../store/useAuthStore';
import { getDepartmentLabel } from '../../../../utils/department';
// import { useEffect } from 'react';

const ProfileCard = () => {
  const user = useAuthStore((state) => state.user);
  const userDepartmentValue = user?.departmentName || '';
  const departmentLabel = getDepartmentLabel(userDepartmentValue);

  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className='bg-white w-full h-[242px] flex justify-center items-center rounded-2xl'>
      <ProfileImage imageUrl={user.profileImageUrl} width='194px' height='194px' />
      <div id='contentbox' className='flex flex-col mb-4 gap-4 mt-1 ml-8'>
        <div className='w-78 flex flex-col border-2 border-grey-05 px-4.5 py-4 rounded-xl'>
          <p className='text-3xl font-medium'>{user.nickname}</p>
          <div className='w-full flex gap-2'>
            <p className='text-black'>{departmentLabel}</p>
            <p className='text-grey-40'>|</p>
            <p className='text-black'>{user.studentNumber}</p>
          </div>
          <p className='text-grey-40'>{user.email}</p>
        </div>
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
    </div>
  );
};

export default ProfileCard;
