'use client';

import Button from '../../atoms/button';

interface TabComponentProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const tabs = ['일반공지', '학사공지', '장학공지', '진로공지', '학사일정', '학생활동', '학칙개정'];

const TabComponent = ({ currentTab, setCurrentTab }: TabComponentProps) => {
  return (
    <div className='flex flex-wrap gap-2 border-b border-gray-200 pb-3'>
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={currentTab === tab ? 'main' : 'sub'}
          size='sm'
          onClick={() => setCurrentTab(tab)}
        >
          {tab}
        </Button>
      ))}
    </div>
  );
};

export default TabComponent;
