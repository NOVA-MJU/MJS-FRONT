import { useAuthStore } from '../../../../store/useAuthStore';
import ActivityBox from '../../../molecules/user/ActivityBox';

interface ActivitiesSectionProps {
  postCount: number;
  commentCount: number;
  likedCount: number;
}
const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  postCount,
  commentCount,
  likedCount,
}) => {
  const user = useAuthStore();
  return (
    <div>
      <p className='w-[600px] text-mju-primary text-3xl font-bold m-auto mb-6'>나의 활동</p>
      <div className='flex gap-4'>
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
