import {
  getBoards,
  type BoardItem,
  type BoardSortBy,
  type BoardDirection,
  type Category,
} from '@/api/board';
import { SkeletonProfile } from '@/components/atoms/Skeleton';
import { formatToElapsedTime } from '@/utils';
import { handleError } from '@/utils/error';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import { IoIosHeartEmpty, IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

/**
 * 카테고리 및 페이지 길이 조절
 */
const ITEM_COUNT = 10;

/**
 * 메인페이지에 표시할 자유게시판 위젯 컴포넌트
 */
export default function BoardSection() {
  const [category, setCategory] = useState<'NOTICE' | 'FREE'>('NOTICE');
  const [contents, setContents] = useState<BoardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 정렬 상태 추가
  const [sortConfig, setSortConfig] = useState<{
    label: string;
    sortBy: BoardSortBy;
    direction: BoardDirection;
  }>({
    label: '추천순',
    sortBy: 'likeCount',
    direction: 'DESC',
  });

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await getBoards({
          page: 0,
          size: ITEM_COUNT,
          communityCategory: category as Category,
          sortBy: sortConfig.sortBy,
          direction: sortConfig.direction,
        });
        setContents(res.content);
      } catch (e) {
        handleError(e, '게시글을 불러오는 중 오류가 발생했습니다.', { showToast: false });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [category, sortConfig]);

  const SORT_OPTIONS: { label: string; sortBy: BoardSortBy; direction: BoardDirection }[] = [
    { label: '추천순', sortBy: 'likeCount', direction: 'DESC' },
    { label: '최신순', sortBy: 'createdAt', direction: 'DESC' },
    { label: '과거순', sortBy: 'createdAt', direction: 'ASC' },
  ];

  return (
    <section className='relative flex min-h-[500px] flex-col bg-white'>
      {/* 탭 네비게이션 */}
      <div className='bg-grey-02 my-0 flex items-center pt-[8px]'>
        <div className='flex flex-1 items-center overflow-hidden'>
          <button
            onClick={() => setCategory('NOTICE')}
            className={clsx(
              'flex flex-1 items-center justify-center text-[14px] leading-[1.5] transition-colors',
              category === 'NOTICE'
                ? 'border-grey-10 gap-[4px] rounded-tr-[4px] border-r bg-white pt-[10px] pr-[10px] pb-[8px] pl-[12px] font-semibold text-black'
                : 'bg-grey-02 border-grey-10 text-grey-40 border-b px-[12px] pt-[10px] pb-[8px] font-normal',
            )}
          >
            정보게시판
          </button>
          <button
            onClick={() => setCategory('FREE')}
            className={clsx(
              'flex flex-1 items-center justify-center text-[14px] leading-[1.5] transition-colors',
              category === 'FREE'
                ? 'border-grey-10 gap-[4px] rounded-tl-[4px] border-l bg-white pt-[10px] pr-[10px] pb-[8px] pl-[12px] font-semibold text-black'
                : 'bg-grey-02 border-grey-10 text-grey-40 border-b px-[12px] pt-[10px] pb-[8px] font-normal',
            )}
          >
            자유게시판
          </button>
        </div>
      </div>

      {/* 정렬 필터 */}
      <div className='flex items-center justify-between px-5 pt-3 pb-1'>
        <div className='flex items-center gap-3'>
          {SORT_OPTIONS.map((item, idx) => {
            const isActive = sortConfig.label === item.label;
            return (
              <button
                key={idx}
                onClick={() => setSortConfig(item)}
                className='flex items-center gap-1 transition-opacity active:opacity-60'
              >
                <div
                  className={clsx(
                    'h-[3px] w-[3px] rounded-full',
                    isActive ? 'bg-grey-80' : 'bg-grey-20',
                  )}
                />
                <span
                  className={clsx(
                    'text-[12px] leading-[1.5]',
                    isActive ? 'text-grey-80 font-medium' : 'text-grey-20',
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        <IoIosArrowForward className='text-grey-20' size={16} />
      </div>

      {/* 게시글 리스트 */}
      <div className='flex flex-1 flex-col'>
        {isLoading && [...Array(ITEM_COUNT)].map((_, index) => <SkeletonProfile key={index} />)}

        {!isLoading &&
          (() => {
            const maxLikeCount =
              contents.length > 0 ? Math.max(...contents.map((c) => c.likeCount)) : 0;

            return contents.map((content, index) => {
              const isLast = index === contents.length - 1;
              const isHot = maxLikeCount > 0 && content.likeCount === maxLikeCount;

              return (
                <Link
                  key={content.uuid}
                  to={`/board/${content.uuid}`}
                  className='active:bg-blue-05 transition-colors'
                >
                  <div className='flex flex-col gap-2 px-5 py-2.5'>
                    {/* 제목 및 본문 */}
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-1'>
                        {isHot && (
                          <div className='flex h-[20px] w-[40px] shrink-0 items-center justify-center rounded-[27px] bg-[#3b96ff]'>
                            <span className='text-[11px] leading-[1.5] font-medium text-white'>
                              HOT
                            </span>
                          </div>
                        )}
                        <h3 className='text-body02 line-clamp-1 font-semibold text-black'>
                          {content.title}
                        </h3>
                      </div>
                      <p className='text-body05 line-clamp-2 text-black'>
                        {content.previewContent}
                      </p>
                    </div>

                    {/* 메타 정보 */}
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        {/* 좋아요 */}
                        <div className='flex items-center gap-1'>
                          <IoIosHeartEmpty size={24} className='text-blue-10' />
                          <span className='text-caption02 text-grey-40'>{content.likeCount}</span>
                        </div>
                        {/* 댓글 */}
                        <div className='flex items-center gap-1'>
                          <HiOutlineChatBubbleOvalLeftEllipsis size={24} className='text-blue-10' />
                          <span className='text-caption02 text-grey-40'>
                            {content.commentCount}
                          </span>
                        </div>
                      </div>

                      {/* 날짜 */}
                      <span className='text-caption02 text-grey-40'>
                        {formatToElapsedTime(content.publishedAt)}
                      </span>
                    </div>
                  </div>
                  {!isLast && <div className='bg-grey-10 h-px w-full' />}
                </Link>
              );
            });
          })()}

        {!isLoading && contents.length === 0 && (
          <div className='flex flex-1 items-center justify-center py-10'>
            <span className='text-body05 text-grey-20'>등록된 게시글이 없습니다.</span>
          </div>
        )}
      </div>

      {/* 글 작성 버튼 (Floating Action Button) */}
      <div className='fixed right-5 bottom-8 z-10'>
        <Link to='/board/write'>
          <div className='bg-blue-35 flex h-[56px] w-[56px] flex-col items-center justify-center rounded-full shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] transition-transform active:scale-95'>
            <img
              src='/img/icon-boardNew.png'
              alt='icon-boardNew'
              className='h-[24px] w-[24px] object-contain'
            />
            <span className='mt-0.5 text-[10px] leading-[1.2] font-medium text-white'>
              글남기기
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
