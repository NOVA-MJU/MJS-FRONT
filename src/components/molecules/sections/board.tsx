import { getBoards, type BoardItem, type Category } from '@/api/board';
import { CardHeader } from '@/components/atoms/Card';
import { SkeletonProfile } from '@/components/atoms/Skeleton';
import { format } from 'date-fns';
import { handleError } from '@/utils/error';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import { IoIosHeartEmpty } from 'react-icons/io';
import Pagination from '@/components/molecules/common/Pagination';
import { MdChevronRight } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';

/**
 * 카테고리 및 페이지 길이 조절
 */
const ITEM_COUNT = 10;

/**
 * 메인페이지에 표시할 자유게시판 위젯 컴포넌트
 */
interface BoardSectionProps {
  showWriteButton?: boolean;
  all?: boolean;
  /** 제공 시 더보기 클릭으로 호출(예: 슬라이드 게시판 탭으로 이동), 미제공 시 /board로 이동 */
  onSeeMoreClick?: () => void;
}

export default function BoardSection({
  showWriteButton = false,
  all = false,
  onSeeMoreClick,
}: BoardSectionProps) {
  const [category, setCategory] = useState<'NOTICE' | 'FREE'>('NOTICE');
  const [contents, setContents] = useState<BoardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await getBoards({
          page,
          size: ITEM_COUNT,
          communityCategory: category as Category,
        });
        setContents(res.content);
        setTotalPages(res.totalPages);
        if (all) setContents(res.content.slice(0, 5));
        else setContents(res.content);
      } catch (e) {
        handleError(e, '게시글을 불러오는 중 오류가 발생했습니다.', { showToast: false });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [category, page]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className='relative mb-4 flex min-h-[400px] flex-col bg-white'>
      {all && (
        <CardHeader className='px-3'>
          <h2 className='text-title03 px-2 font-bold text-black'>게시판</h2>
          {onSeeMoreClick ? (
            <button
              type='button'
              onClick={onSeeMoreClick}
              className='text-grey-30 p-2'
              aria-label='게시판 탭으로 이동'
            >
              <MdChevronRight size={24} className='text-grey-60' />
            </button>
          ) : (
            <Link to='/board' className='text-grey-30 p-2'>
              <MdChevronRight size={24} className='text-grey-60' />
            </Link>
          )}
        </CardHeader>
      )}
      {/* 탭 네비게이션 */}
      {!all && (
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
      )}

      {/* 게시글 리스트 */}
      <div className='flex flex-col pt-4'>
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
                  className='active:bg-blue-05 hover:bg-blue-05 transition-colors'
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
                        {!all && (
                          <p className='text-body04 line-clamp-1 text-black'>{content.title}</p>
                        )}
                        {all && (
                          <p className='text-body05 line-clamp-1 text-black'>
                            {/* <p className='text-body04 line-clamp-1'> */}
                            <b className='mr-1'>
                              {category === 'FREE' ? '자유게시판' : '정보게시판'}
                            </b>
                            {content.title}
                          </p>
                        )}
                      </div>
                      {!all && (
                        <p className='text-body05 line-clamp-2 text-black'>
                          {content.previewContent}
                        </p>
                      )}
                    </div>

                    {/* 메타 정보 */}
                    <div className='flex items-center justify-between'>
                      {/* 날짜 */}
                      {all && (
                        <span className='text-caption02 text-grey-40'>
                          {format(new Date(content.publishedAt), 'yyyy.MM.dd')}
                        </span>
                      )}
                      <div className='flex items-center gap-3'>
                        {/* 좋아요 */}
                        <div className='flex items-center gap-1'>
                          <IoIosHeartEmpty size={20} className='text-blue-10' />
                          <span className='text-caption02 text-grey-40'>{content.likeCount}</span>
                        </div>
                        {/* 댓글 */}
                        <div className='flex items-center gap-1'>
                          <HiOutlineChatBubbleOvalLeftEllipsis size={20} className='text-blue-10' />
                          <span className='text-caption02 text-grey-40'>
                            {content.commentCount}
                          </span>
                        </div>
                      </div>

                      {/* 날짜 */}
                      {!all && (
                        <span className='text-caption02 text-grey-40'>
                          {format(new Date(content.publishedAt), 'yyyy.MM.dd')}
                        </span>
                      )}
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

        {/* 페이지네이션 */}
        {!isLoading && contents.length > 0 && !all && (
          <div className='pb-4'>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      {/* 글 작성 버튼 (Floating Action Button) */}
      {!all &&
        isMounted &&
        showWriteButton &&
        createPortal(
          <div className='fixed right-5 bottom-18 z-50'>
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
          </div>,
          document.body,
        )}
    </section>
  );
}
