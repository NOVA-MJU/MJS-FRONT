'use client';

import { useState } from 'react';
import TabComponent from '../../molecules/mainpage/TabComponent';

interface NotionItem {
  id: number;
  content: string;
}

const dummyData: Record<string, NotionItem[]> = {
  일반공지: [{ id: 1, content: '일반공지 내용입니다.' }],
  학사공지: [
    { id: 1, content: '학사공지입니다. 어쩌구저쩌구 이러쿵저러쿵' },
    { id: 2, content: '2번째 학사공지입니다. 반복 반복 반복입니다.' },
  ],
  장학공지: [{ id: 1, content: '장학공지입니다.' }],
  진로공지: [],
  학사일정: [],
  학생활동: [],
  학칙개정: [],
};

const NotionSection = () => {
  const [selectedTab, setSelectedTab] = useState('일반공지');
  const data = dummyData[selectedTab];
  return (
    <div>
      <TabComponent currentTab={selectedTab} setCurrentTab={setSelectedTab}></TabComponent>
      <div className='p-4 rounded-xl bg-white space-y-2 mt-4'>
        {data.length === 0 ? (
          <p className='text-sm text-gray-500'>해당 탭에 공지사항이 없습니다.</p>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              className='border border-dashed border-blue-400 p-3 rounded bg-grey-10 text-sm text-gray-800'
            >
              {item.content}
            </div>
          ))
        )}
      </div>{' '}
    </div>
  );
};

export default NotionSection;
