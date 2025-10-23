import { useRef, useState, useEffect, useMemo } from 'react';

interface TabComponentProps {
  tabs: Record<string, string>;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

/**
 *
 * @param tabs
 * @param currentTab
 * @param setCurrentTab
 * @returns
 */
export default function Tab({ tabs, currentTab, setCurrentTab }: TabComponentProps) {
  const tabEntries = useMemo(() => Object.entries(tabs || {}), [tabs]);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: '0px',
    width: '0px',
  });

  /**
   * tab 컴포넌트가 해제될 때 현재 탭 목록에 없는 ref들을 메모리에서 해제합니다
   */
  useEffect(() => {
    const currentTabKeys = new Set(tabEntries.map(([, value]) => value));

    Object.keys(tabRefs.current).forEach((key) => {
      if (!currentTabKeys.has(key)) {
        delete tabRefs.current[key];
      }
    });
  }, [tabEntries]);

  /**
   * indicator의 스타일을 업데이트합니다
   */
  useEffect(() => {
    const currentTabElement = tabRefs.current[currentTab];

    if (currentTabElement) {
      const { offsetLeft, clientWidth } = currentTabElement;

      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${clientWidth}px`,
      });
    } else if (tabEntries.length === 0) {
      setIndicatorStyle({ left: '0px', width: '0px' });
    }
  }, [currentTab, tabEntries]);

  return (
    <div className='relative flex border-b-1 border-grey-10 no-scrollbar overflow-x-auto gap-1.5'>
      {tabEntries.map(([label, value]) => {
        const isSelected = currentTab === value;
        return (
          <button
            ref={(el) => {
              tabRefs.current[value] = el;
            }}
            key={value}
            role='tab'
            aria-selected={isSelected}
            aria-controls={`tab-panel-${value}`}
            onClick={() => setCurrentTab(value)}
            className={`
                flex-1 p-1 px-3 md:p-3 md:text-title02 text-body02 cursor-pointer whitespace-nowrap
                ${isSelected ? 'text-blue-35' : 'text-grey-40'}
              `}
          >
            {label}
          </button>
        );
      })}

      {/**
       * 탭 인디케이터
       */}
      <div
        className='
          absolute bottom-0 h-[2px] bg-blue-35
          transition-all duration-300 ease-in-out
        '
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />
    </div>
  );
}
