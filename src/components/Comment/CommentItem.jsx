/** @jsxImportSource @emotion/react */
import { deleteBoardComment, postLikeComment } from '@/api/commentApi';
import Avatar from '@components/Avatar';
import { css } from '@emotion/react';
import { useState } from 'react';
import { LuHeart } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../Button';
import { getTimeElapsed } from '@/util/getTimeElapsed';

export default function CommentItem(props) {
  const [likeCount, setLikeCount] = useState(props.likeCount)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLikeComment = async () => {
    if (isLoading) {
      toast.error('잠시 기다려주세요')
      return
    }

    setIsLoading(true)

    try {
      const response = await postLikeComment(props.boardUuid, props.commentUuid)
      console.log(response.data)

      if (response.data === '좋아요가 추가되었습니다.') {
        setLikeCount(likeCount + 1)
        toast.success(response.data)
      } else {
        setLikeCount(likeCount - 1)
        toast.warn(response.data)
      }
    } catch (e) {
      console.error('error CommentItem.jsx', e)

      if (e.response.status === 403) {
        toast.error('로그인이 필요한 서비스 입니다')
        navigate('/login')
      } else {
        toast.error(e.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteComment = async () => {
    if (isLoading) {
      toast.error('잠시 기다려주세요')
      return
    }

    if (confirm('삭제하시겠습니까?')) {
      setIsLoading(true)

      try {
        const response = await deleteBoardComment(props.commentUuid)
        console.log(response)
        window.location.reload()
      } catch (e) {
        console.error(e)
        toast.error(e.message)

        if (e.response.status === 403) {
          toast.error('로그인이 필요한 서비스 입니다')
          navigate('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div
      css={css`
        width: 100%;
        height: auto;
        box-sizing: border-box;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 12px; 
      `}
    >
      <div css={css`display: flex; align-items: center; gap: 8px;`}>
        <Avatar size={38} />
        <span css={css`font-size: 16px; font-weight: 700; margin: 4px;`}>
          {props.userName}
        </span>
        <span css={css`font-size: 14px; margin: 4px; color: #999;`}>
          {getTimeElapsed(props.createdAt)}
        </span>
        <span css={css`display: flex; align-items: center; font-size: 14px; margin: 4px; color: #999; gap: 0.25rem;`}>
          <LuHeart /> {likeCount}
        </span>
        <Button variant='outline' css={css`color: #999; font-size: 14px`} onClick={handleLikeComment}>
          좋아요
        </Button>
        <Button variant='outline' css={css`color: #999; font-size: 14px`} onClick={handleDeleteComment}>
          삭제
        </Button>
      </div>
      <span>
        {props.content}
      </span>
    </div>
  )

}
