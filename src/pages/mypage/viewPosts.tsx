import { useEffect, useState } from 'react';
import LoadingIndicator from '../../components/atoms/LoadingIndicator';
import { Typography } from '../../components/atoms/Typography';
import Button from '../../components/atoms/Button';
import { getMyPosts, type MyPostItem } from '../../api/mypage';
import NavigationUp from '../../components/molecules/NavigationUp';
import { useNavigate } from 'react-router-dom';
import MyListItem from '../../components/molecules/MyListItem';
import { formatToElapsedTime } from '../../utils';

/**
 * 내가 쓴 게시물 페이지
 *
 * 사용자가 작성한 게시글 목록을 표시하는 페이지입니다.
 * 게시글 제목, 미리보기, 댓글 수, 좋아요 수, 작성 시간을 보여줍니다.
 */
const ViewPosts = () => {
  const [contents, setContents] = useState<MyPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await getMyPosts();
        setContents(res);
      } catch (e) {
        console.error(e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading)
    return (
      <div className='w-full flex-1 flex items-center justify-center'>
        <LoadingIndicator />
      </div>
    );

  if (isError)
    return (
      <div className='flex-1 flex flex-col items-center justify-center gap-4'>
        <Typography variant='body01'>문제가 발생했습니다</Typography>
        <Button shape='rounded'>다시 시도하기</Button>
      </div>
    );

  return (
    <div className='w-full flex-1 bg-grey-05 flex flex-col p-4 md:p-8 gap-3 md:gap-6'>
      <NavigationUp onClick={() => navigate(-1)} />
      <Typography variant='heading01' className='text-mju-primary'>
        내가 쓴 게시물
      </Typography>
      {contents ? (
        <div className='bg-white p-3 flex flex-col gap-3 rounded-lg'>
          {contents.map((content, index) => (
            <MyListItem
              key={content.uuid}
              id={content.uuid}
              title={content.title}
              contentPreview={content.previewContent}
              commentCount={content.commentCount}
              likeCount={content.likeCount}
              publishedDate={formatToElapsedTime(content.publishedAt)}
              isLast={index === contents.length - 1}
            />
          ))}
        </div>
      ) : (
        <>
          <Typography variant='body01'>아직 작성한 게시글이 없습니다</Typography>
        </>
      )}
    </div>
  );
};

export default ViewPosts;
