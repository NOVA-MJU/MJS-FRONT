import { IoIosArrowBack } from 'react-icons/io';
import { Typography } from '../../../components/atoms/Typography';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Comment from '../../../components/organisms/Comment';
import Markdown from 'react-markdown';
import '../markdown.css';
import {
  deletePost,
  getBoardComments,
  getBoardDetail,
  likePost,
  postComment,
  type BoardDetailRes,
  type CommentRes,
} from '../../../api/board';
import Button from '../../../components/atoms/Button';
import LoadingIndicator from '../../../components/atoms/LoadingIndicator';

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

  /**
   * 글 삭제 함수
   */
  const handleDeletePost = async () => {
    if (!uuid || isLoading) return;

    if (!window.confirm('삭제하시겠습니까?')) return;

    setIsLoading(true);
    try {
      const response = await deletePost(uuid);
      console.log(response);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 좋아요 표시 함수
   */
  const handleLikePost = async () => {
    if (!uuid || !content || isLoading) return;

    try {
      const response = await likePost(uuid);
      console.log(response);

      setContent((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          likeCount: prev.liked ? prev.likeCount - 1 : prev.likeCount + 1,
          liked: !prev.liked,
        };
      });
    } catch (err) {
      console.error(err);
      alert(err);
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
            <Link to={`/board/edit/${uuid}`}>
              <button className='w-46 bg-grey-10 cursor-pointer p-3 rounded-xl'>
                <Typography variant='body02' className='text-black'>
                  수정
                </Typography>
              </button>
            </Link>
            <Button
              variant='danger'
              shape='rounded'
              disabled={false}
              fullWidth={false}
              className='p-3 w-46'
              onClick={handleDeletePost}
            >
              삭제
            </Button>
          </div>
        )}
      </div>
      {isLoading ? (
        <div className='h-screen w-full flex justify-center items-center'>
          <LoadingIndicator />
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
                ☒ {content.likeCount} | ☒ {content.commentCount}
              </Typography>
            </div>
          </div>
          <hr className='w-full h-[2px] bg-grey-05 rounded-full border-0' />

          <div className='markdown w-full px-29 py-3 break-all'>
            <Markdown>{content.content}</Markdown>
          </div>

          <div className='flex px-3'>
            <button className='cursor-pointer' onClick={handleLikePost}>
              <Typography variant='body02' className='text-mju-primary'>
                좋아요 ☒
              </Typography>
            </button>
          </div>
          <hr className='h-[2px] bg-grey-05 rounded-full border-0' />
          <div className='flex justify-start px-3'>
            <Typography variant='title02' className='text-mju-primary'>
              댓글
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
          {comments && (
            <>
              {comments.length === 0 ? (
                <></>
              ) : (
                <div className='bg-grey-05 p-6 gap-6 rounded-xl flex flex-col'>
                  {comments.map((comment) => (
                    <Comment
                      key={comment.commentUUID}
                      authorName={comment.nickname}
                      content={comment.content}
                      createdAt={comment.createdAt}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
