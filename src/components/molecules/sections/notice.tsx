import { fetchNotionInfo } from '@/api/main/notice-api';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ChipTabs } from '@/components/atoms/Tabs';
import type { NoticeItem } from '@/types/notice/noticeInfo';
import { formatToElapsedTime } from '@/utils';
import { handleError } from '@/utils/error';
import { useEffect, useState } from 'react';

const tabNameMap: Record<string, string> = {
  all: '전체',
  general: '일반',
  academic: '학사',
  scholarship: '장학',
  career: '진로',
  activity: '학생활동',
  rule: '학칙개정',
};

const categoryNameMap: Record<string, string> = {
  general: '일반',
  academic: '학사',
  scholarship: '장학',
  career: '진로',
  activity: '학생활동',
  rule: '학칙개정',
};

/**
 * 불러올 공지사항 데이터 갯수를 지정하세요
 */
const CONTENT_LENGTH = 7;

export default function NoticeSection() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedInfo, setSelectedInfo] = useState<NoticeItem[]>([]);
  const [allDataCache, setAllDataCache] = useState<Record<string, NoticeItem[]>>({});
  const recentYear = new Date().getFullYear();
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 공지사항 데이터 조회
   */
  useEffect(() => {
    (async () => {
      /**
       * 캐시에 데이터가 있는지 확인합니다
       */
      if (allDataCache[selectedTab]) {
        setSelectedInfo(allDataCache[selectedTab]);
        setIsLoading(false);
        /**
         * 캐시에 데이터가 없으면 api를 호출합니다
         */
      } else {
        try {
          setIsLoading(true);
          const fetchedNoticeData = await fetchNotionInfo(
            selectedTab,
            recentYear,
            0,
            CONTENT_LENGTH,
          );
          setSelectedInfo(fetchedNoticeData.content);
          setAllDataCache((prevCache) => ({
            ...prevCache,
            [selectedTab]: fetchedNoticeData.content,
          }));
        } catch (e) {
          handleError(e, '공지사항을 불러오는 중 오류가 발생했습니다.', { showToast: false });
          setSelectedInfo([]);
        } finally {
          setIsLoading(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, recentYear]);

  /**
   * 공지사항 아이템 컴포넌트 (피그마 디자인 적용)
   */
  const NoticeCard = ({ info }: { info: NoticeItem }) => (
    <a
      href={info.link}
      target='_blank'
      rel='noopener noreferrer'
      className='hover:bg-blue-05 active:bg-blue-10 flex flex-col gap-[3px] border-b border-[#f0f2f5] px-5 py-[10px] transition-colors last:border-0'
    >
      <span className='text-[12px] font-semibold text-[#5dabff]'>
        {categoryNameMap[info.category] || info.category}
      </span>
      <p className='line-clamp-2 text-[14px] leading-[1.5] text-[#17171b]'>{info.title}</p>
      <span className='text-[11px] text-[#aeb2b6]'>{formatToElapsedTime(info.date)}</span>
    </a>
  );

  return (
    <section className='flex flex-col gap-4'>
      <div className='px-3'>
        <ChipTabs tabs={tabNameMap} currentTab={selectedTab} setCurrentTab={setSelectedTab} />
      </div>

      <div className='flex flex-col'>
        {isLoading &&
          [...Array(CONTENT_LENGTH)].map((_, index) => (
            <div key={index} className='border-b border-[#f0f2f5] px-5 py-[10px] last:border-0'>
              <Skeleton className='mb-1 h-3 w-10' />
              <Skeleton className='mb-1 h-5 w-full' />
              <Skeleton className='h-3 w-16' />
            </div>
          ))}
        {!isLoading &&
          selectedInfo.map((info, i) => <NoticeCard key={`${info.link}-${i}`} info={info} />)}
      </div>
    </section>
  );
}
