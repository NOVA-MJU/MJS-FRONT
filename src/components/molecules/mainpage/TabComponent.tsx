'use client';

interface TabComponentProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const tabNameMap: Record<string, string> = {
  일반공지: 'general',
  학사공지: 'academic',
  장학공지: 'scholarship',
  진로공지: 'career',
  학생활동: 'activity',
  학칙개정: 'rule',
};

const tabNameMapKeys = Object.keys(tabNameMap);
const TabComponent = ({ currentTab, setCurrentTab }: TabComponentProps) => {
  return (
    <div className='flex flex-row justify-center gap-16 border-b  border-grey-20 pb-2'>
      {tabNameMapKeys.map((tab) => (
        <button
          key={tab}
          onClick={() => setCurrentTab(tabNameMap[tab])}
          className={`text-l pb-1 font-medium transition-colors duration-200
            ${currentTab === tabNameMap[tab] ? 'text-l font-medium text-blue-20 border-b-2 border-blue-20' : 'text-grey-20'}
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabComponent;
