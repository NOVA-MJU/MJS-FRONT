import { useEffect, useRef, useState } from 'react';
import Avatar from '../../atoms/Avatar';
import { Typography } from '../../atoms/Typography';

interface CommentProps {
  key: string;
  authorName: string;
  //   authorImage: string;
  content: string;
  //   likeCount: number;
  createdAt: string;
  //   liked: boolean;
}

export default function Comment({
  key,
  authorName,
  //   authorImage,
  content,
  //   likeCount,
  createdAt,
  //   liked,
}: CommentProps) {
  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentInputCounterRef = useRef<HTMLParagraphElement>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 메뉴가 열린 상태에서 메뉴 영역 밖을 클릭 했을 때 메뉴가 close되도록
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  return (
    <div key={key} className='gap-3 flex flex-col' ref={containerRef}>
      <div className='relative flex'>
        <div className='flex-1 gap-3 flex'>
          <Avatar size={40} />
          <div className='flex flex-col gap-[2px]'>
            <Typography variant='body02' className='text-black'>
              {authorName}
            </Typography>
            <Typography variant='caption02' className='text-grey-40'>
              {formatDate(createdAt)}
            </Typography>
          </div>
        </div>
        <button
          className='flex items-center justify-center cursor-pointer'
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <Typography variant='caption02' className='text-black'>
            ☒
          </Typography>
        </button>
        {menuOpen && (
          <div className='absolute top-8 right-4 w-46 h-24 bg-white flex flex-col p-3 gap-3 border-2 border-grey-10 rounded-xl'>
            <button className='cursor-pointer'>
              <Typography variant='body03' className='text-black'>
                수정
              </Typography>
            </button>
            <hr className='border-1 border-grey-05' />
            <button className='cursor-pointer'>
              <Typography variant='body03' className='text-black'>
                신고
              </Typography>
            </button>
          </div>
        )}
      </div>
      <div className='p-6 gap-3 bg-white rounded-xl'>
        <Typography variant='body03' className='text-black'>
          {content}
        </Typography>
      </div>
      <div className='gap-3 flex'>
        <button
          className='rounded-[14px] gap-1 px-2 py-1 flex bg-grey-10 cursor-pointer'
          onClick={() => setShowReplyForm((prev) => !prev)}
        >
          <Typography variant='caption02' className='text-black'>
            ☒
          </Typography>
          <Typography variant='caption02' className='text-blue-35'>
            댓글
          </Typography>
        </button>
        <button className='rounded-[14px] gap-1 px-2 py-1 flex bg-grey-10 cursor-pointer'>
          <Typography variant='caption02' className='text-black'>
            ☒
          </Typography>
          <Typography variant='caption02' className='text-blue-35'>
            공감
          </Typography>
        </button>
      </div>

      <div className='mt-3'></div>

      {showReplyForm && (
        <div className='mt-3 gap-6 flex'>
          {/* height가 하드코딩 되어있음 */}
          <hr className='w-0.5 h-18 bg-blue-10 rounded-[1px] border-0' />
          <div className='flex-1 flex flex-col items-end gap-1'>
            <input
              className='w-full p-3 border-2 border-grey-05 rounded-xl bg-white placeholder-grey-20'
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
              입력
            </Typography>
          </button>
        </div>
      )}
    </div>
  );
}

// function timeAgo(isoDate: string): string {
//   const now = Date.now();
//   const then = new Date(isoDate).getTime();
//   const diffSec = Math.floor((now - then) / 1000);

//   const MIN = 60;
//   const HOUR = 60 * MIN;
//   const DAY = 24 * HOUR;
//   const MONTH = 30 * DAY;
//   const YEAR = 365 * DAY;

//   if (diffSec < MIN) {
//     return '방금 전';
//   } else if (diffSec < HOUR) {
//     const m = Math.floor(diffSec / MIN);
//     return `${m}분 전`;
//   } else if (diffSec < DAY) {
//     const h = Math.floor(diffSec / HOUR);
//     return `${h}시간 전`;
//   } else if (diffSec < MONTH) {
//     const d = Math.floor(diffSec / DAY);
//     return `${d}일 전`;
//   } else if (diffSec < YEAR) {
//     const mo = Math.floor(diffSec / MONTH);
//     return `${mo}개월 전`;
//   } else {
//     const y = Math.floor(diffSec / YEAR);
//     return `${y}년 전`;
//   }
// }

function formatDate(input: string): string {
  const d = new Date(input);
  const Y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, '0');
  const D = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${Y}.${M}.${D} ${h}:${m}`;
}
