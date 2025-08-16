import { useEffect, useState } from 'react';
import NavigationUp from '../../components/molecules/NavigationUp';
import { Typography } from '../../components/atoms/Typography';
import MyListItem from '../../components/molecules/MyListItem';
import { formatToElapsedTime } from '../../utils';
import Button from '../../components/atoms/Button';
import LoadingIndicator from '../../components/atoms/LoadingIndicator';
import { useNavigate } from 'react-router-dom';
import { getMyLikedPosts, type MyPostItem } from '../../api/mypage';

const ViewLikedPosts = () => {
  const [contents, setContents] = useState<MyPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await getMyLikedPosts();
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
    <div className='w-full flex-1 bg-grey-05 flex flex-col px-7 py-12 gap-6'>
      <NavigationUp onClick={() => navigate(-1)} />
      <Typography variant='heading01' className='text-mju-primary'>
        찜한 글
      </Typography>
      {contents ? (
        <div className='bg-white p-3 flex flex-col gap-3 rounded-xl'>
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

export default ViewLikedPosts;
