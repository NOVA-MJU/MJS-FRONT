import { useEffect, useState } from 'react';
import { getMyCommentedPosts, type MyCommentedPostItem } from '../../api/mypage';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from '../../components/atoms/LoadingIndicator';
import { Typography } from '../../components/atoms/Typography';
import Button from '../../components/atoms/Button';
import NavigationUp from '../../components/molecules/NavigationUp';
import MyListItem from '../../components/molecules/MyListItem';
import { formatToElapsedTime } from '../../utils';

const ViewComments = () => {
  const [contents, setContents] = useState<MyCommentedPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await getMyCommentedPosts();
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
        내가 쓴 댓글
      </Typography>
      {contents ? (
        <div className='bg-white p-3 flex flex-col gap-3 rounded-xl'>
          {contents.map((content, index) => (
            <MyListItem
              key={content.boardUuid}
              id={content.boardUuid}
              title={content.boardTitle}
              contentPreview={content.boardPreviewContent}
              commentCount={content.boardViewCount}
              likeCount={content.boardLikeCount}
              publishedDate={formatToElapsedTime(content.boardCreatedAt)}
              commentPreview={content.commentPreviewContent}
              isLast={index === contents.length - 1}
            />
          ))}
        </div>
      ) : (
        <Typography variant='body01'>아직 작성한 게시글이 없습니다</Typography>
      )}
    </div>
  );
};

export default ViewComments;
