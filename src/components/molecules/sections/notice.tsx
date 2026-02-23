import { fetchNotionInfo } from '@/api/main/notice-api';
import { CardHeader } from '@/components/atoms/Card';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ChipTabs } from '@/components/atoms/Tabs';
import type { NoticeItem } from '@/types/notice/noticeInfo';
import { format } from 'date-fns';
import { handleError } from '@/utils/error';
import { useEffect, useState } from 'react';
import { MdChevronRight } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Pagination from '../common/Pagination';

export const tabNameMap: Record<string, string> = {
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

/**
 * 전용 공지사항 헤더
 * onSeeMoreClick이 있으면 더보기 클릭 시 해당 콜백 실행(예: 슬라이드 내 공지사항 탭으로 이동), 없으면 /notice 페이지로 이동
 */
const NoticeSlideHeader = ({ onSeeMoreClick }: { onSeeMoreClick?: () => void }) => (
  <CardHeader className='px-1'>
    <h2 className='text-title03 px-3 font-bold text-black'>공지사항</h2>
    {onSeeMoreClick ? (
      <button
        type='button'
        onClick={onSeeMoreClick}
        className='text-grey-30 p-2'
        aria-label='공지사항 탭으로 이동'
      >
        <MdChevronRight size={24} className='text-grey-60' />
      </button>
    ) : (
      <Link to='/notice' className='text-grey-30 p-2'>
        <MdChevronRight size={24} className='text-grey-60' />
      </Link>
    )}
  </CardHeader>
);

/**
 * 슬라이드용 공지사항 아이템 컴포넌트
 */
const NoticeSlideCard = ({ info }: { info: NoticeItem }) => {
  const displayDate = format(new Date(info.date), 'yyyy.MM.dd');

  return (
    <a
      href={info.link}
      target='_blank'
      rel='noopener noreferrer'
      className='hover:bg-blue-05 active:bg-blue-10 flex flex-col justify-center rounded-[4px] px-5 py-3 transition-colors'
    >
      <div className='flex items-center justify-between gap-2'>
        <p className='text-body05 text-grey-60 line-clamp-1 flex-1'>{info.title}</p>
        <span className='text-caption04 text-grey-30 whitespace-nowrap'>{displayDate}</span>
      </div>
    </a>
  );
};

export function NoticeSlideSection({
  all = false,
  onSeeMoreClick,
}: {
  all?: boolean;
  /** 제공 시 더보기(화살표) 클릭으로 호출되며, 미제공 시 /notice로 이동 */
  onSeeMoreClick?: () => void;
}) {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedInfo, setSelectedInfo] = useState<NoticeItem[]>([]);
  const [allDataCache, setAllDataCache] = useState<Record<string, NoticeItem[]>>({});
  const recentYear = new Date().getFullYear();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (allDataCache[selectedTab]) {
        setSelectedInfo(allDataCache[selectedTab]);
        setIsLoading(false);
      } else {
        try {
          setIsLoading(true);
          const fetchedNoticeData = await fetchNotionInfo(selectedTab, 0, CONTENT_LENGTH);
          if (all) setSelectedInfo(fetchedNoticeData.content.slice(0, 5));
          else setSelectedInfo(fetchedNoticeData.content);
          setAllDataCache((prevCache) => ({
            ...prevCache,
            [selectedTab]: all ? fetchedNoticeData.content.slice(0, 5) : fetchedNoticeData.content,
          }));
        } catch (e) {
          handleError(e, '공지사항을 불러오는 중 오류가 발생했습니다.', { showToast: false });
          setSelectedInfo([]);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [selectedTab, recentYear, allDataCache]);

  return (
    <section className='flex flex-col gap-3'>
      <NoticeSlideHeader onSeeMoreClick={onSeeMoreClick} />

      <div className='px-3'>
        <ChipTabs tabs={tabNameMap} currentTab={selectedTab} setCurrentTab={setSelectedTab} />
      </div>

      <div className='flex flex-col pt-1'>
        {isLoading &&
          [...Array(CONTENT_LENGTH)].map((_, index) => (
            <div key={index} className='px-5 py-3'>
              <div className='flex justify-between gap-2'>
                <Skeleton className='h-4 flex-1' />
                <Skeleton className='h-3 w-12' />
              </div>
            </div>
          ))}
        {!isLoading &&
          selectedInfo.map((info, i) => <NoticeSlideCard key={`${info.link}-${i}`} info={info} />)}
      </div>
    </section>
  );
}

export default function NoticeSection() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedInfo, setSelectedInfo] = useState<NoticeItem[]>([]);
  const recentYear = new Date().getFullYear();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  /**
   * 공지사항 데이터 조회
   */
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const fetchedNoticeData = await fetchNotionInfo(selectedTab, page, 10, 'desc');
        setSelectedInfo(fetchedNoticeData.content);
        setTotalPages(fetchedNoticeData.totalPages);
      } catch (e) {
        handleError(e, '공지사항을 불러오는 중 오류가 발생했습니다.', { showToast: false });
        setSelectedInfo([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedTab, recentYear, page]);

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
      <span className='text-[11px] text-[#aeb2b6]'>
        {format(new Date(info.date), 'yyyy.MM.dd')}
      </span>
    </a>
  );

  return (
    <section className='mt-4 flex flex-col'>
      <div className='mb-4 px-3'>
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
      {/* 페이지네이션 */}
      {!isLoading && selectedInfo.length > 0 && (
        <div className='mb-4'>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </section>
  );
}
