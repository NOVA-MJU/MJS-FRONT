import { useEffect, useState } from 'react';
import MyListItem from '../../components/molecules/MyListItem';
import { FormatToDotDate } from '../../utils';
import Button from '../../components/atoms/Button';
import LoadingIndicator from '../../components/atoms/LoadingIndicator';
import { getMyLikedPosts, type MyPostItem } from '../../api/mypage';

const ViewLikedPosts = () => {
  const [contents, setContents] = useState<MyPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

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
      <div className='flex w-full flex-1 items-center justify-center'>
        <LoadingIndicator />
      </div>
    );

  if (isError)
    return (
      <div className='flex flex-1 flex-col items-center justify-center gap-4'>
        <p className='text-body01'>문제가 발생했습니다</p>
        <Button shape='rounded'>다시 시도하기</Button>
      </div>
    );

  return (
    <div className='flex w-full flex-1 flex-col bg-white p-4 md:gap-2 md:p-8'>
      <p className='text-title02 text-blue-35 mt-2 ml-2'>찜한 게시물</p>
      {contents ? (
        <div className='bg-white'>
          {contents.map((content, index) => (
            <MyListItem
              key={content.uuid}
              id={content.uuid}
              title={content.title}
              contentPreview={content.previewContent}
              commentCount={content.commentCount}
              likeCount={content.likeCount}
              publishedDate={FormatToDotDate(content.publishedAt)}
              isLast={index === contents.length - 1}
            />
          ))}
        </div>
      ) : (
        <>
          <p className='text-body01'>아직 작성한 게시글이 없습니다</p>
        </>
      )}
    </div>
  );
};

export default ViewLikedPosts;
