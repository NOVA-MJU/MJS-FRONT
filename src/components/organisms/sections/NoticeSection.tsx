import { useEffect, useState } from 'react';
import TabComponent from '../../molecules/mainpage/Tab';
import { fetchNotionInfo } from '../../../api/main/notice-api';
import type { NoticeItem } from '../../../types/notice/noticeInfo';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const NoticeSection = () => {
  const [selectedTab, setSelectedTab] = useState('general');
  const [selectedInfo, setSelectedInfo] = useState<NoticeItem[]>([]);
  const selectedCategory = selectedTab;
  const recentYear = new Date().getFullYear();
  const navigator = useNavigate();

  const handleClickPlus = () => navigator('/notice');

  useEffect(() => {
    const fetchingData = async () => {
      try {
        const fetchedNoticeData = await fetchNotionInfo(selectedCategory, recentYear);
        setSelectedInfo(fetchedNoticeData.content);
      } catch (e) {
        console.log('FC 내부 NoticeData Fetching 실패', e);
      }
    };
    fetchingData();
  }, [selectedTab]);

  return (
    <div>
      <div className='flex justify-between mt-4'>
        <h1 className='text-xl font-bold text-mju-primary mb-4'>공지사항</h1>
        <button
          type='button'
          onClick={handleClickPlus}
          className='h-6 w-6 grid place-items-center rounded hover:bg-gray-100 active:bg-gray-200'
          aria-label='공지사항 더보기'
          title='공지사항 더보기'
        >
          <FiPlus size={20} />
        </button>
      </div>

      <TabComponent currentTab={selectedTab} setCurrentTab={setSelectedTab} />

      <div className='grid grid-cols-1 gap-2 mt-5'>
        {selectedInfo.map((data, idx) => (
          <div key={idx} className='bg-white'>
            <a
              href={data.link}
              target='_blank'
              rel='noopener noreferrer'
              className='
                block p-4 border border-grey-10 rounded-xl shadow-sm
                
                md:hover:bg-grey-10 md:hover:shadow-md   /* 데스크톱 hover */
                active:bg-grey-10                         /* 모바일/터치 press */
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-mju-primary/30
              '
            >
              <h3 className='text-lg font-semibold text-black truncate'>{data.title}</h3>
              <div className='mt-2 text-sm text-gray-600'>
                <span className='font-medium'>{new Date(data.date).toLocaleDateString()}</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeSection;
