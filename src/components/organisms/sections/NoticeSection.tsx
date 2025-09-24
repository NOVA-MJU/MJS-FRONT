import { useEffect, useState } from 'react';
import TabComponent from '../../molecules/mainpage/Tab';
import { fetchNotionInfo } from '../../../api/main/notice-api';
import type { NoticeItem } from '../../../types/notice/noticeInfo';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import Divider from '../../atoms/Divider';
import { formatToElapsedTime } from '../../../utils';

export default function NoticeSection() {
  const [selectedTab, setSelectedTab] = useState('general');
  const [selectedInfo, setSelectedInfo] = useState<NoticeItem[]>([]);
  const recentYear = new Date().getFullYear();

  useEffect(() => {
    (async () => {
      try {
        const fetchedNoticeData = await fetchNotionInfo(selectedTab, recentYear);
        setSelectedInfo(fetchedNoticeData.content);
      } catch (e) {
        console.error('NoticeSection.tsx::useEffect()', e);
      }
    })();
  }, [selectedTab]);

  return (
    <>
      <section className='hidden md:flex flex-col gap-3'>
        <div className='px-3 flex justify-between items-center'>
          <h2 className='text-heading02 text-mju-primary'>공지사항</h2>
          <Link to='/notice'>
            <IoIosArrowForward className='text-blue-10' size={20} />
          </Link>
        </div>
        <div className='px-3'>
          <TabComponent currentTab={selectedTab} setCurrentTab={setSelectedTab} />
        </div>
        <div className='p-3 flex flex-col gap-3 rounded-xl border-2 border-grey-05'>
          {selectedInfo.map((info, i) => (
            <>
              <a
                href={info.link}
                target='_blank'
                rel='noopener noreferrer'
                className='p-3 cursor-pointer hover:bg-blue-05 transition flex justify-between rounded-xl'
              >
                <p className='text-body02'>{info.title}</p>
                <span className='text-caption01'>{formatToElapsedTime(info.date)}</span>
              </a>
              {i < 4 && <Divider variant='thin' />}
            </>
          ))}
        </div>
      </section>

      <section className='md:hidden flex flex-col gap-4'>
        <div className='px-3 flex justify-between items-center'>
          <h2 className='text-heading02 text-mju-primary'>공지사항</h2>
          <Link to='/notice'>
            <IoIosArrowForward className='text-blue-10' size={20} />
          </Link>
        </div>
        <div className='px-3'>
          <TabComponent currentTab={selectedTab} setCurrentTab={setSelectedTab} />
        </div>
        <div className='flex flex-col gap-2'>
          {selectedInfo.map((info) => (
            <a
              href={info.link}
              target='_blank'
              rel='noopener noreferrer'
              className='p-4 flex flex-col gap-2 cursor-pointer hover:bg-blue-05 transition rounded-xl border-1 border-blue-05'
            >
              <p className='text-body02 text-black'>{info.title}</p>
              <span className='text-caption01 text-grey-20'>{formatToElapsedTime(info.date)}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
