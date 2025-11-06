import { type BoardItem, getBoards, type Category } from '@/api/board';
import { Tabs } from '@/components/atoms/Tabs';
import { useEffect, useState } from 'react';
import { IoIosHeartEmpty } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { HiOutlineChatBubbleOvalLeftEllipsis } from 'react-icons/hi2';
import { formatToElapsedTime } from '@/utils';
import { SkeletonProfile } from '@/components/atoms/Skeleton';

/**
 * 카테고리 및 페이지 길이 조절
 */
const CATEGORIES: Record<string, string> = {
  FREE: '자유게시판',
  NOTICE: '정보게시판',
};
const ITEM_COUNT = 4;

/**
 * 메인페이지에 표시할 자유게시판 위젯 컴포넌트
 */
export default function BoardSection() {
  const [category, setCategory] = useState<keyof typeof CATEGORIES>('FREE');
  const [contents, setContents] = useState<BoardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await getBoards(0, ITEM_COUNT, category as Category);
        setContents(res.content);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [category]);

  return (
    <section>
      <div className='flex flex-col gap-2'>
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
                  className={`
                  w-full h-fit
                  ${!isLast && 'border-b border-grey-05'}
                `}
                >
                  <div className='flex flex-col gap-2 mb-2'>
                    {/* 제목표시영역 */}
                    <div className='px-1 flex flex-col gap-1'>
                      <span className='text-body04 text-black line-clamp-1'>{content.title}</span>
                      <span className='text-body05 text-black line-clamp-2'>
                        {content.previewContent}
                      </span>
                    </div>
                    {/* 날짜표시영역 */}
                    <div className='px-1 flex items-center justify-between'>
                      <div className='flex items-center gap-1'>
                        <IoIosHeartEmpty size={12} className='text-blue-10' />
                        <span className='text-caption04 text-grey-40'>{content.likeCount}</span>
                        <HiOutlineChatBubbleOvalLeftEllipsis size={12} className='text-blue-10' />
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
