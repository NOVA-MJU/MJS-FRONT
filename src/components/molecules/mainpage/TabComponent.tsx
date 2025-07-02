'use client';

interface TabComponentProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const tabs = ['일반공지', '학사공지', '장학공지', '진로공지', '학사일정', '학생활동', '학칙개정'];

const TabComponent = ({ currentTab, setCurrentTab }: TabComponentProps) => {
  return (
    <div className='flex flex-wrap gap-19 border-b border-mju-secondary pb-2'>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setCurrentTab(tab)}
          className={`text-sm pb-1 font-medium transition-colors duration-200
            ${currentTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabComponent;
