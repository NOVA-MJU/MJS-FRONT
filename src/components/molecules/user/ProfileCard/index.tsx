import Button from '../../../atoms/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../store/useAuthStore';
import { getDepartmentLabel } from '../../../../utils/department';
import Avatar from '../../../atoms/Avatar';
import { Typography } from '../../../atoms/Typography';

const ProfileCard = () => {
  const user = useAuthStore((state) => state.user);
  const userDepartmentValue = user?.departmentName || '';
  const departmentLabel = getDepartmentLabel(userDepartmentValue);

  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className='bg-white p-4 md:p-6 gap-4 md:gap-6 flex items-center rounded-lg'>
      <Avatar src={user.profileImageUrl} className='w-20 h-20 md:w-40 md:h-40' />
      <div id='contentbox' className='flex-1 flex flex-col gap-4'>
        <div className='gap-0.5 md:gap-1 p-2 md:p-4 flex flex-col border-2 border-grey-05 rounded-lg'>
          <Typography variant='heading02'>{user.nickname}</Typography>
          <Typography variant='body02'>{departmentLabel}</Typography>
          <Typography variant='body02'>{user.studentNumber}</Typography>
          <Typography variant='body03' className='text-grey-40'>
            {user.email}
          </Typography>
        </div>
        <div className='hidden md:block'>
          <Button
            variant='blue35'
            size='lg'
            fullWidth
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
