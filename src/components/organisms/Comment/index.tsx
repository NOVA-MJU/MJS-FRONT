import { useState } from 'react';
import { IoIosClose, IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { IoChatbubbles, IoChatbubblesOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { deleteComment, postCommentReply, toggleLikeComment, type CommentRes } from '@/api/board';
import Avatar from '@/components/atoms/Avatar';
import { formatToElapsedTime } from '@/utils';
import { useResponsive } from '@/hooks/useResponse';
import { CommentForm } from '@/components/atoms/CommentForm';
import clsx from 'clsx';

export const MAX_REPLY_LEN = 100;

interface CommentProps {
  commentUuid: string;
  boardUuid: string;
  authorName: string;
  profileImageUrl?: string;
  content: string;
  likeCount: number;
  createdAt: string;
  liked: boolean;
  replies: CommentRes[];
  isReply?: boolean;
  isAuthor: boolean;
  isLoggedin: boolean;
}

export default function Comment({
  commentUuid,
  boardUuid,
  authorName,
  profileImageUrl,
  content,
  likeCount,
  createdAt,
  liked,
  replies,
  isReply = false,
  isAuthor = false,
  isLoggedin = false,
}: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likedLocal, setLikedLocal] = useState(liked);
  const [likeCountLocal, setLikeCountLocal] = useState(likeCount);
  const [repliesLocal, setRepliesLocal] = useState(replies);
  const [newReplyContent, setNewReplyContent] = useState('');
  const [deleted, setDeleted] = useState(false);
  const { isDesktop } = useResponsive();

  /**
   * 댓글을 삭제합니다
   */
  const handleDeleteComment = async () => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    if (isLoading) return;
    setIsLoading(true);
    try {
      await deleteComment(boardUuid, commentUuid);
      setDeleted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 댓글에 좋아요를 표시합니다
   */
  const handleLikeComment = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await toggleLikeComment(boardUuid, commentUuid);
      setLikedLocal(!likedLocal);
      if (likedLocal) setLikeCountLocal(likeCountLocal - 1);
      else setLikeCountLocal(likeCountLocal + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 대댓글을 작성합니다
   */
  const handleCommentReply = async () => {
    if (isLoading) return;

    if (newReplyContent.trim().length < 2) {
      toast.error('댓글을 2글자 이상 작성해 주세요');
      return;
    } else if (newReplyContent.trim().length > 100) {
      toast.error('100자 이내로 작성해주세요');
      return;
    }

    setIsLoading(true);
    try {
      const res = await postCommentReply(boardUuid, commentUuid, newReplyContent.trim());
      setNewReplyContent('');
      setRepliesLocal(repliesLocal.concat(res));
    } catch (e) {
      alert('문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (deleted) return;

  /**
   * pc버전 댓글 컴포넌트
   */
  if (isDesktop)
    return (
      <div key={commentUuid} className='gap-3 flex flex-col'>
        <div className='relative flex justify-between'>
          <div className='gap-3 flex'>
            <Avatar src={profileImageUrl} />
            <div className='flex flex-col gap-[2px]'>
              <span className='text-body02 text-black'>{authorName}</span>
              <span className='text-caption02 text-grey-40'>{formatToElapsedTime(createdAt)}</span>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            {isAuthor && (
              <button
                className='rounded-[14px] gap-1 px-2 py-1 flex bg-grey-10 cursor-pointer'
                onClick={handleDeleteComment}
              >
                <span className='text-caption02 text-blue-35 flex gap-1 items-center'>삭제</span>
              </button>
            )}
            <button className='rounded-[14px] gap-1 px-2 py-1 flex bg-grey-10 cursor-pointer'>
              <span className='text-caption02 text-blue-35 flex gap-1 items-center'>신고</span>
            </button>
          </div>
        </div>
        <div className='p-6 gap-3 bg-white rounded-xl'>
          <span className='text-body03 text-black'>{content}</span>
        </div>
        <div className='gap-3 flex'>
          {!isReply && (
            <button
              className='rounded-[14px] gap-1 px-2 py-1 flex bg-grey-10 cursor-pointer'
              onClick={() => setShowReplyForm((prev) => !prev)}
            >
              <span className='text-caption02 text-blue-35 flex gap-1 items-center'>
                {showReplyForm ? <IoChatbubbles /> : <IoChatbubblesOutline />}
                댓글
              </span>
            </button>
          )}
          <button
            className='rounded-[14px] gap-1 px-2 py-1 flex bg-grey-10 cursor-pointer'
            onClick={handleLikeComment}
          >
            <span className='text-caption02 text-blue-35 flex gap-1 items-center'>
              {likedLocal ? <IoIosHeart /> : <IoIosHeartEmpty />}
              {`공감 ${likeCountLocal || ''}`}
            </span>
          </button>
        </div>
        <div className='pl-6 mt-3 gap-6 flex flex-col border-l-2 border-blue-10'>
          {!isReply &&
            repliesLocal.map((comment) => (
              <Comment
                key={comment.commentUUID}
                commentUuid={comment.commentUUID}
                boardUuid={boardUuid}
                authorName={comment.nickname}
                content={comment.content}
                createdAt={comment.createdAt}
                profileImageUrl={comment.profileImageUrl}
                likeCount={comment.likeCount}
                liked={comment.liked}
                replies={comment.replies}
                isReply
                isAuthor={comment.commentIsAuthor}
                isLoggedin={isLoggedin}
              />
            ))}
          {showReplyForm && (
            <div className='flex gap-4'>
              <div className='flex-1 flex flex-col items-end gap-1'>
                <input
                  className='w-full p-3 border-2 border-grey-05 rounded-xl bg-white placeholder-grey-20'
                  placeholder='PlaceHolder'
                  type='text'
                  value={newReplyContent}
                  onChange={(e) => setNewReplyContent(e.target.value)}
                  maxLength={MAX_REPLY_LEN}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCommentReply();
                  }}
                />
                <span className='text-caption02 text-grey-40'>
                  {`${newReplyContent.trim().length}/${MAX_REPLY_LEN}`}
                </span>
              </div>
              <button
                className='w-16 md:w-46 h-12 bg-blue-35 cursor-pointer p-3 rounded-xl'
                onClick={handleCommentReply}
              >
                <span className='text-body02 text-white'>입력</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );

  /**
   * 모바일 버전 댓글 컴포넌트
   */
  if (!isDesktop)
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2.5'>
          <div className='flex gap-3 items-center'>
            <Avatar src={profileImageUrl} className='h-10 w-10' />
            <div className='flex-1 flex flex-col gap-0.5'>
              <span className='text-body04 text-black'>{authorName}</span>
              <span className='text-caption02 text-grey-40'>{formatToElapsedTime(createdAt)}</span>
            </div>
            {/**
             * 댓글 삭제 버튼
             */}
            {isAuthor && (
              <button
                className='w-5 h-5 rounded-full bg-grey-20 cursor-pointer text-white'
                onClick={handleDeleteComment}
              >
                <IoIosClose size={20} />
              </button>
            )}
          </div>
          <p className='text-body05'>{content}</p>
          <div className='flex gap-1.5'>
            {isLoggedin && !isReply && (
              <button
                className='px-1.5 py-1 flex gap-1 items-center text-caption02 text-blue-35 bg-grey-05 rounded-[14px] cursor-pointer'
                onClick={() => setShowReplyForm((prev) => !prev)}
              >
                {showReplyForm ? <IoChatbubbles /> : <IoChatbubblesOutline />}
                댓글
              </button>
            )}
            <button
              className={clsx(
                'px-1.5 py-1 flex gap-1 items-center text-caption02 text-blue-35 bg-grey-05 rounded-[14px]',
                isLoggedin && 'cursor-pointer',
              )}
              onClick={handleLikeComment}
              disabled={!isLoggedin}
            >
              {likedLocal ? <IoIosHeart /> : <IoIosHeartEmpty />}
              {`공감 ${likeCountLocal || ''}`}
            </button>
          </div>
        </div>

        {/**
         * 대댓글 작성 폼
         */}
        {showReplyForm && (
          <CommentForm
            newComment={newReplyContent}
            setNewComment={setNewReplyContent}
            handleCommentUpload={handleCommentReply}
            MAX_REPLY_LEN={MAX_REPLY_LEN}
            isLoggedin={isLoggedin}
          />
        )}

        {/**
         * 대댓글 표시
         */}
        {repliesLocal && (
          <div className='ps-2.5 border-s-2 border-blue-10 flex flex-col gap-4'>
            {repliesLocal.map((comment) => (
              <Comment
                key={comment.commentUUID}
                commentUuid={comment.commentUUID}
                boardUuid={boardUuid}
                authorName={comment.nickname}
                content={comment.content}
                createdAt={comment.createdAt}
                profileImageUrl={comment.profileImageUrl}
                likeCount={comment.likeCount}
                liked={comment.liked}
                replies={comment.replies}
                isReply
                isAuthor={comment.commentIsAuthor}
                isLoggedin={isLoggedin}
              />
            ))}
          </div>
        )}
      </div>
    );
}
