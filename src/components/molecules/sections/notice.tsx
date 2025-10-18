import { fetchNotionInfo } from '@/api/main/notice-api';
import Divider from '@/components/atoms/Divider';
import { Skeleton } from '@/components/atoms/Skeleton';
import Tab from '@/components/atoms/Tab';
import { useResponsive } from '@/hooks/useResponse';
import type { NoticeItem } from '@/types/notice/noticeInfo';
import { formatToElapsedTime } from '@/utils';
import React from 'react';
import { useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

const tabNameMap: Record<string, string> = {
  일반공지: 'general',
  학사공지: 'academic',
  장학공지: 'scholarship',
  진로공지: 'career',
  학생활동: 'activity',
  학칙개정: 'rule',
};

export default function NoticeSection() {
  const [selectedTab, setSelectedTab] = useState('general');
  const [selectedInfo, setSelectedInfo] = useState<NoticeItem[]>([]);
  const recentYear = new Date().getFullYear();
  const [isLoading, setIsLoading] = useState(true);
  const { isDesktop } = useResponsive();

  /**
   * 공지사항 데이터 조회
   */
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const fetchedNoticeData = await fetchNotionInfo(selectedTab, recentYear);
        setSelectedInfo(fetchedNoticeData.content);
      } catch (e) {
        console.error('NoticeSection.tsx::useEffect()', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [selectedTab, recentYear]);

  if (isDesktop) {
    return (
      <section className='flex flex-col gap-3'>
        <div className='px-3 flex justify-between items-center'>
          <h2 className='text-heading02 text-mju-primary'>공지사항</h2>
          <Link to='/notice'>
            <IoIosArrowForward className='text-blue-10' size={20} />
          </Link>
        </div>
        <div className='px-3'>
          <Tab tabs={tabNameMap} currentTab={selectedTab} setCurrentTab={setSelectedTab} />
        </div>
        <div className='p-3 flex flex-col gap-3 rounded-xl border-2 border-grey-05'>
          {isLoading &&
            [...Array(5)].map((_, index) => (
              <React.Fragment key={index}>
                <Skeleton className='h-12' />
                {index < 4 && <Divider variant='thin' />}
              </React.Fragment>
            ))}
          {!isLoading &&
            selectedInfo.map((info, i) => (
              <React.Fragment key={info.link}>
                <a
                  href={info.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-3 cursor-pointer hover:bg-blue-05 transition flex flex-col md:flex-row gap-2 justify-between rounded-xl'
                >
                  <p className='text-body02 line-clamp-2'>{info.title}</p>
                  <span className='text-caption01 text-grey-40'>
                    {formatToElapsedTime(info.date)}
                  </span>
                </a>
                {i < 4 && <Divider variant='thin' />}
              </React.Fragment>
            ))}
        </div>
      </section>
    );
  } else if (!isDesktop) {
    return (
      <section>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-title01 text-blue-35'>공지사항</h2>
            <Link to='/notice' className='text-caption01 text-grey-20'>
              더보기
            </Link>
          </div>
          <div className='flex flex-col gap-3'>
            <Tab tabs={tabNameMap} currentTab={selectedTab} setCurrentTab={setSelectedTab} />
            <div className='flex flex-col gap-1'>
              {isLoading &&
                [...Array(5)].map((_, index) => <Skeleton key={index} className='my-1 h-7' />)}
              {!isLoading &&
                selectedInfo.map((info, index) => (
                  <MobileNoticeItem
                    key={index}
                    link={info.link}
                    title={info.title}
                    publishedDate={formatToElapsedTime(info.date)}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

interface MobileNoticeItemProps {
  link: string;
  title: string;
  publishedDate: string;
}

function MobileNoticeItem({ link, title, publishedDate }: MobileNoticeItemProps) {
  return (
    <a
      href={link}
      target='_blank'
      rel='noopener noreferrer'
      className='py-2 flex gap-2.5 justify-between'
    >
      <span className='text-body04 text-black flex-1 line-clamp-1'>{title}</span>
      <span className='text-caption02 text-grey-40'>{publishedDate}</span>
    </a>
  );
}
