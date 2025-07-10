import { useEffect, useState } from 'react';
import TabComponent from '../../molecules/mainpage/TabComponent';
import { fetchNotionInfo } from '../../../api/notice/noticeApi';
import type { NoticeItem } from '../../../types/notice/noticeInfo';

const NoticeSection = () => {
  const [selectedTab, setSelectedTab] = useState('general');
  const [selectedInfo, setSelectedInfo] = useState<NoticeItem[]>([]);
  const selectedCategory = selectedTab;
  const recentYear = new Date().getFullYear();

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
      <div className='flex justify-between'>
        <h1 className='text-xl font-bold text-mju-primary mb-4'>공지사항</h1>
        <span>
          {/* <FiPlus size={20} /> 더보기 공지사항 유라님이 만드신 경로에 라우팅 로직 필요 */}
        </span>
      </div>
      <TabComponent currentTab={selectedTab} setCurrentTab={setSelectedTab}></TabComponent>
      <div className='grid grid-cols-1 gap-2 mt-5 '>
        {selectedInfo.map((data, idx) => (
          <div className='bg-grey-05 '>
            <a
              href={data.link}
              target='_blank'
              rel='noopener noreferrer'
              key={idx}
              className='block p-4 border border-grey-10 rounded-xl shadow-sm hover:shadow-md transition-shadow'
            >
              <h3 className='text-lg font-semibold text-blue-800 truncate'>{data.title}</h3>
              <div className='mt-2 text-sm text-gray-600'>
                <p>
                  <span className='font-medium'>{new Date(data.date).toLocaleDateString()}</span>
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeSection;
