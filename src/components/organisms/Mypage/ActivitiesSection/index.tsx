import { useAuthStore } from '../../../../store/useAuthStore';
import { Typography } from '../../../atoms/Typography';
import ActivityBox from '../../../molecules/user/ActivityBox';

interface ActivitiesSectionProps {
  postCount: number;
  commentCount: number;
  likedCount: number;
}
const ActivitiesSection = ({ postCount, commentCount, likedCount }: ActivitiesSectionProps) => {
  const user = useAuthStore();
  return (
    <div className='flex flex-col gap-2'>
      <Typography variant='title02' className='text-mju-primary'>
        나의 활동
      </Typography>
      <div className='flex gap-2 md:gap-4 flex-col md:flex-row'>
        <ActivityBox
          label={'내가 쓴 게시물'}
          count={postCount}
          link={`/mypage/my-post/${user?.user?.uuid}`}
        />
        <ActivityBox
          label={'내가 쓴 댓글'}
          count={commentCount}
          link={`/mypage/my-comment/${user?.user?.uuid}`}
        />
        <ActivityBox
          label={'찜한 글'}
          count={likedCount}
          link={`/mypage/my-likes/${user?.user?.uuid}`}
        />
      </div>
    </div>
  );
};
export default ActivitiesSection;
