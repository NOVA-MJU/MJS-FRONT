import { getBoards, type BoardItem, type Category } from '@/api/board';
import { SkeletonProfile } from '@/components/atoms/Skeleton';
import { Tabs } from '@/components/atoms/Tabs';
import { ICON_SIZE_SM } from '@/constants/common';
import { formatToElapsedTime } from '@/utils';
import { handleError } from '@/utils/error';
import { useEffect, useState } from 'react';
import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import { IoIosHeartEmpty } from 'react-icons/io';
import { Link } from 'react-router-dom';

/**
 * 카테고리 및 페이지 길이 조절
 */
const CATEGORIES: Record<string, string> = {
  NOTICE: '정보게시판',
  FREE: '자유게시판',
};
const ITEM_COUNT = 4;

/**
 * 메인페이지에 표시할 자유게시판 위젯 컴포넌트
 */
export default function BoardSection() {
  const [category, setCategory] = useState<keyof typeof CATEGORIES>('NOTICE');
  const [contents, setContents] = useState<BoardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await getBoards({
          page: 0,
          size: ITEM_COUNT,
          communityCategory: category as Category,
        });
        setContents(res.content);
      } catch (e) {
        handleError(e, '게시글을 불러오는 중 오류가 발생했습니다.', { showToast: false });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [category]);

  return (
    <section>
      <div className='flex flex-col gap-2 px-3'>
        {/* 탭 선택기 */}
        <Tabs tabs={CATEGORIES} currentTab={category} setCurrentTab={setCategory} />

        {/* 게시글 표시 */}
        <div className='flex flex-col gap-2'>
          {isLoading && [...Array(6)].map((_, index) => <SkeletonProfile key={index} />)}

          {!isLoading &&
            contents.map((content, index) => {
              const isLast = index === contents.length - 1;

              return (
                <Link
                  to={`/board/${content.uuid}`}
                  className={`h-fit w-full ${!isLast && 'border-grey-05 border-b'} `}
                >
                  <div className='mb-2 flex flex-col gap-2'>
                    {/* 제목표시영역 */}
                    <div className='flex flex-col gap-1 px-1'>
                      <span className='text-body04 line-clamp-1 text-black'>{content.title}</span>
                      <span className='text-body05 line-clamp-2 text-black'>
                        {content.previewContent}
                      </span>
                    </div>
                    {/* 날짜표시영역 */}
                    <div className='flex items-center justify-between px-1'>
                      <div className='flex items-center gap-1'>
                        <IoIosHeartEmpty size={ICON_SIZE_SM} className='text-blue-10' />
                        <span className='text-caption04 text-grey-40'>{content.likeCount}</span>
                        <HiOutlineChatBubbleOvalLeftEllipsis
                          size={ICON_SIZE_SM}
                          className='text-blue-10'
                        />
                        <span className='text-caption04 text-grey-40'>{content.commentCount}</span>
                      </div>
                      <span className='text-caption02 text-grey-40'>
                        {formatToElapsedTime(content.publishedAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </section>
  );
}
