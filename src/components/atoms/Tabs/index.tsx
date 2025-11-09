import clsx from 'clsx';

interface TabComponentProps {
  tabs: Record<string, string>;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

/**
 * 탭 네비게이션 컴포넌트
 * `tabs` prop을 기반으로 클릭 가능한 탭 목록을 표시하며, 활성화된 탭 하단에 인디케이터 바가 표시됩니다.
 *
 * @param tabs - 탭을 정의하는 객체. 객체의 **키(key)**는 영문 식별자, **값(value)**은 탭에 표시될 **레이블(label)**입니다. (예: { 'all': '전체', 'in-progress': '진행 중' })
 * @param currentTab - 현재 활성화된 탭의 고유 **식별자(key)**입니다.
 * @param setCurrentTab - 탭 클릭 시 호출되는 함수. 클릭된 탭의 **식별자(key)**를 인자로 받습니다.
 * @returns JSX Element
 */
function Tabs({ tabs, currentTab, setCurrentTab }: TabComponentProps) {
  const tabEntries = Object.entries(tabs);

  return (
    <div className='flex border-b-1 border-grey-10 no-scrollbar overflow-x-auto gap-1.5'>
      {tabEntries.map(([key, label]) => {
        const isSelected = currentTab === key;
        return (
          <button
            key={key}
            role='tab'
            aria-selected={isSelected}
            aria-controls={`tab-panel-${key}`}
            onClick={() => setCurrentTab(key)}
            className={`
                flex-1 p-1 px-3 md:p-3 md:text-title02 text-body02 cursor-pointer whitespace-nowrap
                ${isSelected ? 'text-blue-35 border-b-2 border-blue-35' : 'text-grey-40'}
              `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * 칩 네비게이션 컴포넌트
 * `tabs` prop을 기반으로 클릭 가능한 칩 목록을 표시하고, 활성화된 칩은 색상이 변경됩니다.
 *
 * @param tabs - 탭을 정의하는 객체. 객체의 **키(key)**는 영문 식별자, **값(value)**은 탭에 표시될 **레이블(label)**입니다. (예: { 'all': '전체', 'in-progress': '진행 중' })
 * @param currentTab - 현재 활성화된 탭의 고유 **식별자(key)**입니다.
 * @param setCurrentTab - 탭 클릭 시 호출되는 함수. 클릭된 탭의 **식별자(key)**를 인자로 받습니다.
 * @returns JSX Element
 */
function ChipTabs({ tabs, currentTab, setCurrentTab }: TabComponentProps) {
  const tabEntries = Object.entries(tabs);

  return (
    <div className='flex no-scrollbar overflow-x-auto gap-1.5'>
      {tabEntries.map(([key, label]) => {
        const isSelected = currentTab === key;
        return (
          <button
            key={key}
            role='tab'
            aria-selected={isSelected}
            aria-controls={`tab-panel-${key}`}
            onClick={() => setCurrentTab(key)}
            className={clsx`
              px-3 py-1.5 rounded-full text-caption03 cursor-pointer whitespace-nowrap
                ${isSelected ? 'bg-blue-35 text-white' : 'border border-grey-10 text-grey-20'}
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export { Tabs, ChipTabs };
