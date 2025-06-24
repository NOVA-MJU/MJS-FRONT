import { IoIosArrowBack } from 'react-icons/io';
import { Typography } from '../../../components/atoms/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BoardDetail() {
  const navigate = useNavigate();
  const [post] = useState(dummyPost);

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
      <div className='w-full px-29 py-3'>
        <Typography variant='body03'>{post.content}</Typography>
      </div>
      <div className='flex justify-end'>
        <Typography variant='body02'>좋아요 ☒</Typography>
      </div>
      <hr className='w-full h-[2px] bg-grey-05 rounded-full border-0' />
      <div className='flex justify-start'>
        <Typography variant='title02' className='text-mju-primary'>
          좋아요
        </Typography>
      </div>
      <div className='w-full'></div>
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
  content:
    '본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 본문이 어쩌구 저쩌구 이러쿵 저러쿵 어쩌렴 저쩌렴 ',
  comments: [
    {
      id: 1,
      author: '댓글러',
      date: '2025-06-23',
      content: '첫 번째 댓글입니다.',
    },
    {
      id: 2,
      author: '익명유저',
      date: '2025-06-23',
      content: '두 번째 댓글입니다.',
    },
  ],
};
