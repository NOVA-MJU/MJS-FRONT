import clsx from 'clsx';

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

const tabs = Object.entries(tabNameMap);

export default function TabComponent({ currentTab, setCurrentTab }: TabComponentProps) {
  return (
    <>
      {/* 데스크톱: 라인 탭 */}
      <div className='hidden px-3 md:flex justify-between border-b-1 border-grey-10'>
        {tabs.map(([label, value]) => {
          const isSelected = currentTab === value;
          return (
            <button
              key={value}
              role='tab'
              aria-selected={isSelected}
              aria-controls={`tab-panel-${value}`}
              onClick={() => setCurrentTab(value)}
              className={`
                p-3 text-title02 cursor-pointer
                ${isSelected ? 'text-blue-35 border-b-2 border-blue-35' : 'text-grey-40'}
              `}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 모바일: 캐러셀 탭 (필 스타일 + 센터 스냅) */}
      <div className='md:hidden no-scrollbar overflow-x-auto flex gap-1.5'>
        {tabs.map(([label, value]) => {
          const isSelected = currentTab === value;
          return (
            <button
              key={value}
              onClick={() => setCurrentTab(value)}
              className={clsx(
                'text-caption01 rounded-full px-3 py-1.5 cursor-pointer',
                isSelected
                  ? 'text-white bg-blue-35'
                  : 'text-grey-20 border-1 border-grey-20 bg-white',
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}
