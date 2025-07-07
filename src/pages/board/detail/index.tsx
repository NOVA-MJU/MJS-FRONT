import { IoIosArrowBack } from 'react-icons/io';
import { Typography } from '../../../components/atoms/Typography';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Comment from '../../../components/organisms/Comment';
import Markdown from 'react-markdown';
import '../markdown.css';
import {
  getBoardComments,
  getBoardDetail,
  postComment,
  type BoardDetailRes,
  type CommentRes,
} from '../../../api/board';
import LoadingComponent from '../../../components/atoms/Loading/LoadingComponent';

interface BoardDetail {
  id: string;
  title: string;
  date: string;
  author: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  content: string;
}

export default function BoardDetail() {
  const navigate = useNavigate();
  const { uuid } = useParams<{ uuid: string }>();
  const [content, setContent] = useState<BoardDetailRes | null>(null);
  const [comments, setComments] = useState<CommentRes[] | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!uuid) return;
    getContent(uuid);
  }, [uuid]);

  /**
   * 페이지 로드 함수
   */
  const getContent = async (uuid: string) => {
    setIsLoading(true);

    try {
      const contentRes = await getBoardDetail(uuid);
      const commentsRes = await getBoardComments(uuid);

      setContent(contentRes);
      setComments(commentsRes);
    } catch (err) {
      console.error(err);
      alert('페이지를 로드하는 중 문제가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 댓글 작성 함수
   */
  const handleCommentUpload = async () => {
    if (!uuid || isLoading) return;

    if (newComment.length <= 2) {
      alert('댓글을 작성해 주세요');
      return;
    } else if (newComment.length > 100) {
      alert('100자 이내로 작성해주세요');
      return;
    }

    try {
      setIsLoading(true);
      await postComment(uuid, newComment);
      await getContent(uuid);
      setNewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full h-full flex flex-col px-9 py-12 gap-6'>
      <div className='w-full flex justify-between'>
        <div className='flex items-center cursor-pointer gap-2' onClick={() => navigate(-1)}>
          <IoIosArrowBack className='text-[16px] text-blue-10' />
          <Typography variant='body03' className='text-blue-10'>
            이전
          </Typography>
        </div>
        {content && (
          <div className='flex items-center gap-6'>
            <button className='w-46 bg-grey-10 cursor-pointer p-3 rounded-xl'>
              <Typography variant='body02' className='text-black'>
                수정
              </Typography>
            </button>
            <button className='w-46 bg-error cursor-pointer p-3 rounded-xl'>
              <Typography variant='body02' className='text-white'>
                삭제
              </Typography>
            </button>
          </div>
        )}
      </div>
      {isLoading ? (
        <div className='h-screen w-full flex justify-center items-center'>
          <LoadingComponent />
        </div>
      ) : !content ? (
        <div className='h-screen w-full flex flex-col justify-center items-center'>
          <Typography variant='heading01'>404</Typography>
          <Typography variant='heading01'>페이지를 찾을 수 없습니다</Typography>
        </div>
      ) : (
        <>
          <div className='flex flex-col w-full p-3, gap-3'>
            <Typography variant='heading02'>{content.title}</Typography>
            <div className='flex justify-between'>
              <Typography variant='body03' className='text-grey-40'>
                {content.publishedAt} | {content.author}
              </Typography>
              <Typography variant='body03' className='text-grey-40'>
                ☒ {content.viewCount} | ☒ {content.commentCount}
              </Typography>
            </div>
          </div>
          <hr className='w-full h-[2px] bg-grey-05 rounded-full border-0' />

          <div className='markdown w-full px-29 py-3 break-all'>
            <Markdown>{content.content}</Markdown>
            {/* <Typography variant='body03'>{content.content}</Typography> */}
          </div>

          <div className='flex px-3'>
            <Typography variant='body02' className='text-mju-primary'>
              좋아요 ☒
            </Typography>
          </div>
          <hr className='h-[2px] bg-grey-05 rounded-full border-0' />
          <div className='flex justify-start px-3'>
            <Typography variant='title02' className='text-mju-primary'>
              좋아요
            </Typography>
          </div>
          <div className='flex gap-6'>
            <div className='flex-1 flex flex-col items-end gap-1'>
              <input
                className='w-full p-3 border-2 border-grey-05 rounded-xl placeholder-grey-20'
                placeholder='PlaceHolder'
                type='text'
                ref={commentInputRef}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className='flex gap-0.5'>
                <Typography variant='caption02' className='text-grey-40'>
                  {newComment.length}
                  {/* <p ref={commentInputCounterRef}>00/00</p> */}
                </Typography>
                <Typography variant='caption02' className='text-grey-40'>
                  {` / 100`}
                </Typography>
              </div>
            </div>
            <button
              className='w-46 h-12 bg-blue-35 cursor-pointer p-3 rounded-xl'
              onClick={handleCommentUpload}
            >
              <Typography variant='body02' className='text-white'>
                전송
              </Typography>
            </button>
          </div>
          <div className='bg-grey-05 p-6 gap-6 rounded-xl flex flex-col'>
            {comments && (
              <>
                {comments.length === 0 ? (
                  <div className='h-32 flex justify-center items-center'>
                    <Typography variant='heading01'>작성된 댓글이 없습니다</Typography>
                  </div>
                ) : (
                  <>
                    {comments.map((comment) => (
                      <Comment
                        key={comment.commentUUID}
                        authorName={comment.nickname}
                        content={comment.content}
                        createdAt={comment.createdAt}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
