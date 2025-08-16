import { useState } from 'react';
import Avatar from '../../atoms/Avatar';
import { Typography } from '../../atoms/Typography';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { formatToElapsedTime } from '../../../utils';
import {
  deleteComment,
  postCommentReply,
  toggleLikeComment,
  type CommentRes,
} from '../../../api/board';
import { IoChatbubbles, IoChatbubblesOutline } from 'react-icons/io5';

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
}: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likedLocal, setLikedLocal] = useState(liked);
  const [likeCountLocal, setLikeCountLocal] = useState(likeCount);
  const [repliesLocal, setRepliesLocal] = useState(replies);
  const [newReplyContent, setNewReplyContent] = useState('');
  const [deleted, setDeleted] = useState(false);

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

    if (newReplyContent.trim().length <= 2) {
      alert('댓글을 2글자 이상 작성해 주세요');
      return;
    } else if (newReplyContent.trim().length > 100) {
      alert('100자 이내로 작성해주세요');
      return;
    }

    setIsLoading(true);
    try {
      const res = await postCommentReply(boardUuid, commentUuid, newReplyContent.trim());
      setNewReplyContent('');
      setRepliesLocal(repliesLocal.concat(res));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (deleted) return;

  return (
    <div key={commentUuid} className='gap-3 flex flex-col'>
      <div className='relative flex justify-between'>
        <div className='gap-3 flex'>
          <Avatar size={40} src={profileImageUrl} />
          <div className='flex flex-col gap-[2px]'>
            <Typography variant='body02' className='text-black'>
              {authorName}
            </Typography>
            <Typography variant='caption02' className='text-grey-40'>
              {formatToElapsedTime(createdAt)}
            </Typography>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <button
            className='rounded-[14px] gap-1 px-2 py-1 flex bg-grey-10 cursor-pointer'
            onClick={handleDeleteComment}
          >
            <Typography variant='caption02' className='text-blue-35 flex gap-1 items-center'>
              {'삭제'}
            </Typography>
          </button>
          <button className='rounded-[14px] gap-1 px-2 py-1 flex bg-grey-10 cursor-pointer'>
            <Typography variant='caption02' className='text-blue-35 flex gap-1 items-center'>
              {'신고'}
            </Typography>
          </button>
        </div>
      </div>
      <div className='p-6 gap-3 bg-white rounded-xl'>
        <Typography variant='body03' className='text-black'>
          {content}
        </Typography>
      </div>
      <div className='gap-3 flex'>
        {!isReply && (
          <button
            className='rounded-[14px] gap-1 px-2 py-1 flex bg-grey-10 cursor-pointer'
            onClick={() => setShowReplyForm((prev) => !prev)}
          >
            <Typography variant='caption02' className='text-blue-35 flex gap-1 items-center'>
              {showReplyForm ? <IoChatbubbles /> : <IoChatbubblesOutline />}
              {'댓글'}
            </Typography>
          </button>
        )}
        <button
          className='rounded-[14px] gap-1 px-2 py-1 flex bg-grey-10 cursor-pointer'
          onClick={handleLikeComment}
        >
          <Typography variant='caption02' className='text-blue-35 flex gap-1 items-center'>
            {likedLocal ? <IoIosHeart /> : <IoIosHeartEmpty />}
            {`공감 ${likeCountLocal || ''}`}
          </Typography>
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
              <Typography variant='caption02' className='text-grey-40'>
                {`${newReplyContent.trim().length}/${MAX_REPLY_LEN}`}
              </Typography>
            </div>
            <button
              className='w-16 md:w-46 h-12 bg-blue-35 cursor-pointer p-3 rounded-xl'
              onClick={handleCommentReply}
            >
              <Typography variant='body02' className='text-white'>
                입력
              </Typography>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
