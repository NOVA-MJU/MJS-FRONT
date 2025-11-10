import { FaArrowUp } from 'react-icons/fa';

interface CommentFormProps {
  newComment: string;
  setNewComment: (value: string) => void;
  handleCommentUpload: () => void;
  MAX_REPLY_LEN: number;
}

/**
 * 댓글 입력 폼 컴포넌트
 * @param newComment - 댓글 입력창의 현재 값 (state)
 * @param setNewComment - newComment state를 업데이트하는 함수
 * @param handleCommentUpload - '전송' 버튼 클릭 또는 Enter 입력 시 호출될 댓글 등록 함수
 * @param MAX_REPLY_LEN - 댓글 최대 글자 수
 * @returns 모바일/데스크탑 환경에 맞는 댓글 입력 폼 컴포넌트
 */
function CommentForm({
  newComment,
  setNewComment,
  handleCommentUpload,
  MAX_REPLY_LEN,
}: CommentFormProps) {
  return (
    <div className='flex flex-col gap-0.5'>
      <div className='relative w-full'>
        <input
          className='w-full text-body05 text-black placeholder-grey-40 bg-grey-05 px-3 py-2.5 rounded-lg '
          placeholder='댓글을 작성해주세요.'
          type='text'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommentUpload();
            }
          }}
        />
        <button
          type='button'
          onClick={handleCommentUpload}
          className='absolute right-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-grey-20 text-white cursor-pointer'
        >
          <FaArrowUp size='16' />
        </button>
      </div>
      <span className='text-caption02 text-grey-40 self-end'>
        {`${newComment.trim().length}/${MAX_REPLY_LEN}`}
      </span>
    </div>
  );
}

export { CommentForm };
