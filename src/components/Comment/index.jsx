/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';
import { getBoardComments } from '../../api/commentApi';
import LoadingComponent from '../util/LoadingComponent';
import CommentItem from './CommentItem';
import { toast } from 'react-toastify';
import CommentForm from './CommentForm';

export default function Comment({ uuid }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [comments, setComments] = useState(null)
  const [commentsVisibleCount, setCommentsVisibleCount] = useState(15)

  const fetchComments = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getBoardComments(uuid)
      setComments(response.data)
    } catch (error) {
      setIsError(true)
      console.error(error)
      toast.error('댓글을 불러오는 중 문제가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }, [uuid])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleViewMoreComments = () => {
    setCommentsVisibleCount(commentsVisibleCount + 15)
  }

  if (isLoading) {
    return (
      <div css={css`flex: 1; padding: 2rem; display: flex; justify-content: center;`}>
        <LoadingComponent message='댓글을 불러오는 중입니다' />
      </div>
    )
  } else if (isError) {
    return (
      <div css={css`flex: 1; padding: 2rem; display: flex; justify-content: center;`}>
        <span css={css`padding: 2rem; font-size: 1.5rem; font-weight: bold;`}>
          문제가 발생했습니다
        </span>
      </div>
    )
  } else {
    return (
      <div css={css`display: flex; flex-direction: column; padding: 16px; gap: 16px;`}>
        <CommentForm uuid={uuid} onCommentAdded={fetchComments} />
        <span>
          댓글 수 {comments.length}개
        </span>
        <div css={css`padding: 8px; gap: 16px;`}>
          {comments.slice(0, commentsVisibleCount).map((comment) => (
            <CommentItem
              key={comment.commentUUID}
              userName={comment.nickname}
              createdAt={comment.createdAt}
              likeCount={comment.likeCount}
              content={comment.content}
              boardUuid={uuid}
              commentUuid={comment.commentUUID} />
          ))}
        </div>
        {comments.length > commentsVisibleCount && (
          <div css={css`display: flex; justify-content: center;`}>
            <button onClick={handleViewMoreComments}>
              <span>
                댓글 더 보기
              </span>
            </button>
          </div>
        )}
      </div>
    )
  }
}
