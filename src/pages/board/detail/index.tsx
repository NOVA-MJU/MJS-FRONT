import { IoIosArrowBack } from 'react-icons/io';
import { Typography } from '../../../components/atoms/Typography';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Comment from '../../../components/organisms/Comment';
import Markdown from 'react-markdown';
import '../markdown.css';

export default function BoardDetail() {
  const navigate = useNavigate();
  const [post] = useState(dummyPost);
  const [comments] = useState(dummyComments);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentInputCounterRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className='w-full h-full flex flex-col px-9 py-12 gap-6'>
      <div className='w-full flex justify-between'>
        <div className='flex items-center cursor-pointer gap-2' onClick={() => navigate(-1)}>
          <IoIosArrowBack className='text-[16px] text-blue-10' />
          <Typography variant='body03' className='text-blue-10'>
            이전
          </Typography>
        </div>
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
      </div>
      <div className='flex flex-col w-full p-3, gap-3'>
        <Typography variant='heading02'>{post.title}</Typography>
        <div className='flex justify-between'>
          <Typography variant='body03' className='text-grey-40'>
            {post.date} | {post.author}
          </Typography>
          <Typography variant='body03' className='text-grey-40'>
            ☒ {post.viewCount} | ☒ {post.commentCount}
          </Typography>
        </div>
      </div>
      <hr className='w-full h-[2px] bg-grey-05 rounded-full border-0' />

      <div className='markdown w-full px-29 py-3 break-all'>
        <Markdown>{post.content}</Markdown>
        {/* <Typography variant='body03'>{post.content}</Typography> */}
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
          />
          <Typography variant='caption02' className='text-grey-40'>
            <p ref={commentInputCounterRef}>00/00</p>
          </Typography>
        </div>
        <button className='w-46 h-12 bg-blue-35 cursor-pointer p-3 rounded-xl'>
          <Typography variant='body02' className='text-white'>
            전송
          </Typography>
        </button>
      </div>
      <div className='bg-grey-05 p-6 gap-6 rounded-xl flex flex-col'>
        {comments.map((comment) => (
          <Comment
            id={comment.commentUUID}
            authorName={comment.nickname}
            content={comment.content}
            createdAt={comment.createdAt}
          />
        ))}
      </div>
    </div>
  );
}

const dummyPost = {
  id: 1,
  title: '제목어쩌구저쩌구이러쿵저러쿵',
  date: '2025-06-23',
  author: '박대럭',
  viewCount: 123,
  commentCount: 2,
  likeCount: 45,
  content: `
  # 다람쥐 헌 쳇바퀴에 타고파

  ## 다람쥐 헌 쳇바퀴에 타고파

  ### 다람쥐 헌 쳇바퀴에 타고파

  다람쥐 헌 쳇바퀴에 타고파

  **다람쥐 헌 쳇바퀴에 타고파**

  # The Quick Brown Fox Jumps Over The Lazy Dog

  ## The Quick Brown Fox Jumps Over The Lazy Dog

  ### The Quick Brown Fox Jumps Over The Lazy Dog

  The Quick Brown Fox Jumps Over The Lazy Dog

  **The Quick Brown Fox Jumps Over The Lazy Dog**
  `,
};

// 더미 댓글 데이터 예시
const dummyComments = [
  {
    commentUUID: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    content: '첫 번째 댓글 내용입니다.',
    nickname: '박재욱대머리',
    likeCount: 2,
    createdAt: '2025-06-29T10:15:30.000Z',
    liked: false,
    replies: [],
  },
  {
    commentUUID: '0p9o8n7m-6l5k-4j3i-2h1g-f6e5d4c3b2a1',
    content: '두 번째 댓글이에요!',
    nickname: '김동삼',
    likeCount: 5,
    createdAt: '2025-06-29T11:20:45.000Z',
    liked: false,
    replies: [],
  },
  {
    commentUUID: '123e4567-e89b-12d3-a456-426614174000',
    content: '세 번째 댓글 테스트.',
    nickname: '남보라 자다가걸림',
    likeCount: 0,
    createdAt: '2025-06-29T12:30:00.000Z',
    liked: false,
    replies: [],
  },
];
