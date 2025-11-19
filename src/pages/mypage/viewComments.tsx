import { useEffect, useState } from 'react';
import { getMyCommentedPosts } from '../../api/mypage';
import LoadingIndicator from '../../components/atoms/LoadingIndicator';
import Button from '../../components/atoms/Button';
import MyListItem from '../../components/molecules/MyListItem';
import { FormatToDotDate } from '../../utils';

interface GroupedCommentPost {
  boardUuid: string;
  boardTitle: string;
  boardPreviewContent: string;
  boardViewCount: number;
  boardLikeCount: number;
  boardCreatedAt: string;
  comments: string[];
}

const ViewComments = () => {
  const [contents, setContents] = useState<GroupedCommentPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await getMyCommentedPosts();
        const groupedObj = res.reduce<Record<string, GroupedCommentPost>>((acc, cur) => {
          const id = cur.boardUuid;

          if (!acc[id]) {
            acc[id] = {
              boardUuid: cur.boardUuid,
              boardTitle: cur.boardTitle,
              boardPreviewContent: cur.boardPreviewContent,
              boardViewCount: cur.boardViewCount,
              boardLikeCount: cur.boardLikeCount,
              boardCreatedAt: cur.boardCreatedAt,
              comments: [],
            };
          }

          if (cur.commentPreviewContent) {
            acc[id].comments.push(cur.commentPreviewContent);
          }

          return acc;
        }, {});

        const groupedArray = Object.values(groupedObj);
        setContents(groupedArray);
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
      <p className='text-title02 text-blue-35 mt-2 ml-2'>내가 쓴 댓글</p>
      {contents.length ? (
        <div className='bg-white'>
          {contents.map((content, index) => (
            <MyListItem
              key={content.boardUuid}
              id={content.boardUuid}
              title={content.boardTitle}
              contentPreview={content.boardPreviewContent}
              commentCount={content.boardViewCount}
              likeCount={content.boardLikeCount}
              publishedDate={FormatToDotDate(content.boardCreatedAt)}
              commentPreview={content.comments}
              isLast={index === contents.length - 1}
            />
          ))}
        </div>
      ) : (
        <p className='text-body01'>아직 작성한 댓글이 없습니다</p>
      )}
    </div>
  );
};

export default ViewComments;
