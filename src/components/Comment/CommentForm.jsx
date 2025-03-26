/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { postBoardComment } from '../../api/commentApi'
import Avatar from '@components/Avatar'
import { reissueAccessToken } from '@/api/apiClient'
import Button from '../Button'

export default function CommentForm({ uuid, onCommentAdded }) {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testReissus = async () => {
    try {
      const response = await reissueAccessToken()
      // console.log(response)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmitComment = async () => {
    if (isLoading) {
      toast.error('잠시 기다려주세요')
      return
    }

    setIsLoading(true)
    try {
      await postBoardComment(uuid, content)
      onCommentAdded();
    } catch (error) {
      if (error.status == 403)
        toast.error('댓글 작성 권한이 없습니다')
      else
        toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div css={css`margin: 16px; padding: 16px; display: flex; flex-direction: row; gap: 16px;`}>
      <div css={css`display: flex; flex-direction: row;`}>
        <div css={css`display:flex; flex-direction: column; gap: 16px;`}>
          <Avatar size={64} />
        </div>
      </div>
      <input
        css={css`flex: 1; font-size: 1rem; padding: 16px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;`}
        type='text'
        placeholder='댓글을 남겨주세요'
        onChange={(e) => setContent(e.target.value)} />
      <Button
        css={css`padding: 10px 20px;`}
        onClick={handleSubmitComment}
      >
        남기기
      </Button>
    </div>
  )
}