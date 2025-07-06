'use client';

import { useEffect, useRef, useState } from 'react';
import TabComponent from '../../molecules/mainpage/TabComponent';
import { fetchNotionInfo } from '../../../api/notice/noticeApi';
import type { NoticeItem } from '../../../types/notice/noticeInfo';

const NoticeSection = () => {
  const [selectedTab, setSelectedTab] = useState('general');
  const [selectedInfo, setSelectedInfo] = useState<NoticeItem[]>([]);
  const selectedCategory = selectedTab;
  const recentYear = new Date().getFullYear();
  const isFetchRef = useRef(false);

  useEffect(() => {
    if (isFetchRef.current) return;
    const fetchingData = async () => {
      try {
        const fetchedNoticeData = await fetchNotionInfo(selectedCategory, recentYear);
        setSelectedInfo(fetchedNoticeData.content);
        console.log(fetchedNoticeData);
        isFetchRef.current = true;
      } catch (e) {
        console.log('FC 내부 NoticeData Fetching 실패', e);
      }
    };
    fetchingData();
  }, []);
  return (
    <div>
      <TabComponent currentTab={selectedTab} setCurrentTab={setSelectedTab}></TabComponent>
      {selectedInfo.map((data, idx) => {
        return <div key={idx}> {data.title}</div>;
      })}
    </div>
  );
};

export default NoticeSection;
