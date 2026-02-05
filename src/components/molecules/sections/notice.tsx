import { fetchNotionInfo } from '@/api/main/notice-api';
import Divider from '@/components/atoms/Divider';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Tabs } from '@/components/atoms/Tabs';
import { ICON_SIZE_LG } from '@/constants/common';
import { useResponsive } from '@/hooks/useResponse';
import type { NoticeItem } from '@/types/notice/noticeInfo';
import { formatToElapsedTime } from '@/utils';
import { handleError } from '@/utils/error';
import React from 'react';
import { useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

export const tabNameMap: Record<string, string> = {
  all: '전체',
  general: '일반공지',
  academic: '학사공지',
  scholarship: '장학공지',
  career: '진로공지',
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
  const { isDesktop } = useResponsive();

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

  if (isDesktop)
    return (
      <section className='flex flex-col gap-3'>
        <div className='flex items-center justify-between px-3'>
          <h2 className='text-heading02 text-mju-primary'>공지사항</h2>
          <Link to='/notice'>
            <IoIosArrowForward className='text-blue-10' size={ICON_SIZE_LG} />
          </Link>
        </div>
        <div className='px-3'>
          <Tabs tabs={tabNameMap} currentTab={selectedTab} setCurrentTab={setSelectedTab} />
        </div>
        <div className='border-grey-05 flex flex-col gap-3 rounded-xl border-2 p-3'>
          {isLoading &&
            [...Array(CONTENT_LENGTH)].map((_, index) => (
              <React.Fragment key={index}>
                <Skeleton className='h-12' />
                {index < CONTENT_LENGTH - 1 && <Divider variant='thin' />}
              </React.Fragment>
            ))}
          {!isLoading &&
            selectedInfo.map((info, i) => (
              <React.Fragment key={info.link}>
                <a
                  href={info.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:bg-blue-05 flex cursor-pointer flex-col justify-between gap-2 rounded-xl p-3 transition md:flex-row'
                >
                  <p className='text-body02 line-clamp-2'>{info.title}</p>
                  <span className='text-caption01 text-grey-40'>
                    {formatToElapsedTime(info.date)}
                  </span>
                </a>
                {i < CONTENT_LENGTH - 1 && <Divider variant='thin' />}
              </React.Fragment>
            ))}
        </div>
      </section>
    );

  if (!isDesktop)
    return (
      <section>
        <div className='flex flex-col gap-3'>
          <Tabs tabs={tabNameMap} currentTab={selectedTab} setCurrentTab={setSelectedTab} />

          {/* 학사공지 아이템 목록 */}
          <div className='flex flex-col gap-1'>
            {isLoading &&
              [...Array(CONTENT_LENGTH)].map((_, index) => (
                <Skeleton key={index} className='my-1 h-7' />
              ))}
            {!isLoading &&
              selectedInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center justify-between gap-1.5 py-2'
                >
                  <span className='line-clamp-1 flex-1 text-[15px] text-black'>{info.title}</span>
                  <span className='text-body05 text-grey-40'>{formatToElapsedTime(info.date)}</span>
                </a>
              ))}
          </div>
        </div>
      </section>
    );
}
