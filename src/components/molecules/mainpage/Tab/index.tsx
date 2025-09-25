import clsx from 'clsx';

interface TabComponentProps {
  tabs: Record<string, string>;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function TabComponent({ tabs, currentTab, setCurrentTab }: TabComponentProps) {
  const tabEntries = Object.entries(tabs);

  return (
    <>
      {/* 데스크톱: 라인 탭 */}
      <div className='hidden md:flex border-b-1 border-grey-10'>
        {tabEntries.map(([label, value]) => {
          const isSelected = currentTab === value;
          return (
            <button
              key={value}
              role='tab'
              aria-selected={isSelected}
              aria-controls={`tab-panel-${value}`}
              onClick={() => setCurrentTab(value)}
              className={`
                w-full p-3 text-title02 cursor-pointer
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
        {tabEntries.map(([label, value]) => {
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
