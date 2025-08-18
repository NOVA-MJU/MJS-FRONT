import { Typography } from '../../../components/atoms/Typography';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Comment from '../../../components/organisms/Comment';
import '../markdown.css';
import {
  deletePost,
  getBoardComments,
  getBoardDetail,
  likePost,
  postComment,
  type CommentRes,
  type GetBoardDetailRes,
} from '../../../api/board';
import Button from '../../../components/atoms/Button';
import NavigationUp from '../../../components/molecules/NavigationUp';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import BlockTextEditor from '../../../components/organisms/BlockTextEditor';
import { RxDividerVertical } from 'react-icons/rx';
import Divider from '../../../components/atoms/Divider';
import { formatToElapsedTime } from '../../../utils';
import { IoChatbubbles } from 'react-icons/io5';
import GlobalErrorPage from '../../error';

const MAX_REPLY_LEN = 100;

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
  const [content, setContent] = useState<GetBoardDetailRes | null>(null);
  const [comments, setComments] = useState<CommentRes[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isError, setIsError] = useState(false);

  /**
   * 페이지 로드 함수
   */
  useEffect(() => {
    if (!uuid) return;
    else getContent(uuid);
  }, [uuid]);

  /**
   * 게시글 데이터 로드 함수
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
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 댓글 작성 핸들러
   */
  const handleCommentUpload = async () => {
    if (!uuid || isLoading) return;

    if (newComment.trim().length <= 2) {
      alert('댓글을 2글자 이상 작성해 주세요');
      return;
    } else if (newComment.trim().length > 100) {
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
   * 게시글 삭제 핸들러
   */
  const handleDeletePost = async () => {
    if (!uuid || isLoading) return;
    if (!window.confirm('삭제하시겠습니까?')) return;
    setIsLoading(true);
    try {
      await deletePost(uuid);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 게시글 좋아요 표시 함수
   */
  const handleLikePost = async () => {
    if (!uuid || !content || isLoading) return;
    setIsLoading(true);
    try {
      await likePost(uuid);

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
    } finally {
      setIsLoading(false);
    }
  };

  if (isError) return <GlobalErrorPage />;

  return (
    <div className='w-full flex-1 flex flex-col p-4 md:p-12 gap-6'>
      <div className='w-full flex justify-between'>
        <NavigationUp onClick={() => navigate(-1)} />
        {content && (
          <div className='flex items-center gap-2 md:gap-4'>
            <Link to={`/board/edit/${uuid}`} state={{ from: 'detail' }}>
              <Button className='p-3 md:w-46' variant='greyBlack' shape='rounded'>
                수정
              </Button>
            </Link>
            <Button
              className='p-3 md:w-46'
              variant='danger'
              shape='rounded'
              onClick={handleDeletePost}
            >
              삭제
            </Button>
          </div>
        )}
      </div>
      {content && (
        <>
          <div className='flex flex-col w-full p-3, gap-3'>
            <Typography variant='heading02'>{content.title}</Typography>
            <div className='flex justify-between'>
              <Typography variant='body03' className='text-grey-40 flex gap-1 items-center'>
                {formatToElapsedTime(content.publishedAt)}
                <RxDividerVertical />
                {content.author}
              </Typography>
              <Typography variant='body03' className='text-grey-40 flex gap-1 items-center'>
                <IoIosHeart />
                {content.likeCount}
                <RxDividerVertical />
                <IoChatbubbles />
                {content.commentCount}
              </Typography>
            </div>
          </div>
          <Divider variant='thin' />
          {/**
           * 컨텐츠 본문을 표시합니다
           */}
          <div className='w-full flex-1 min-h-64 py-3 break-all'>
            <BlockTextEditor readOnly initialContent={content.content} />
          </div>
          {/**
           * 좋아요 버튼을 표시합니다
           */}
          <div className='flex md:px-3'>
            <button
              className='cursor-pointer hover:bg-grey-05 rounded-xl px-3 py-2 transition'
              onClick={handleLikePost}
            >
              <Typography variant='body02' className='text-mju-primary flex gap-1 items-center'>
                좋아요
                {content.liked ? <IoIosHeart /> : <IoIosHeartEmpty />}
              </Typography>
            </button>
          </div>
          <Divider variant='thin' />
          {/**
           * 댓글 입력창을 표시합니다
           */}
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
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCommentUpload();
                  }
                }}
              />
              <div className='flex gap-0.5'>
                <Typography variant='caption02' className='text-grey-40'>
                  {`${newComment.trim().length}/${MAX_REPLY_LEN}`}
                </Typography>
              </div>
            </div>
            <button
              className='w-16 md:w-46 h-12 bg-blue-35 cursor-pointer p-3 rounded-xl'
              onClick={handleCommentUpload}
            >
              <Typography variant='body02' className='text-white'>
                전송
              </Typography>
            </button>
          </div>
          {comments && comments.length !== 0 && (
            <div className='bg-grey-05 p-6 gap-6 rounded-xl flex flex-col'>
              {comments.map((comment) => (
                <Comment
                  key={comment.commentUUID}
                  commentUuid={comment.commentUUID}
                  boardUuid={uuid!}
                  authorName={comment.nickname}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  profileImageUrl={comment.profileImageUrl}
                  likeCount={comment.likeCount}
                  liked={comment.liked}
                  replies={comment.replies}
                />
              ))}
            </div>
          )}
          {comments && comments.length === 0 && (
            <div className='py-16 flex justify-center'>
              <Typography variant='title01'>작성된 댓글이 없습니다</Typography>
            </div>
          )}
        </>
      )}
    </div>
  );
}
