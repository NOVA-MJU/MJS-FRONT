'use client';
import { useRef } from 'react';

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

const tabs = Object.entries(tabNameMap); // [ [label, value], ... ]

export default function TabComponent({ currentTab, setCurrentTab }: TabComponentProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <div className='border-b border-grey-20 pb-2'>
      {/* 데스크톱: 라인 탭 */}
      <div className='hidden md:flex justify-center gap-18'>
        {tabs.map(([label, value]) => {
          const active = currentTab === value;
          return (
            <button
              key={value}
              role='tab'
              aria-selected={active}
              aria-controls={`tab-panel-${value}`}
              onClick={() => setCurrentTab(value)}
              className={`
                
                relative pb-2 text-base transition-colors
                ${active ? 'text-blue-15 font-semibold' : 'text-grey-20 '}
              `}
            >
              {label}
              <span
                className={`
                  absolute left-0 right-0 -bottom-[2px] h-[2px]
                  transition-all duration-200
                  ${active ? 'bg-mju-primary' : 'bg-transparent'}
                `}
              />
            </button>
          );
        })}
      </div>

      {/* 모바일: 캐러셀 탭 (필 스타일 + 센터 스냅) */}
      <div className='md:hidden relative'>
        {/* 캐러셀 스크롤 영역 */}
        <div
          ref={scrollerRef}
          role='tablist'
          aria-label='공지 탭'
          className='
            no-scrollbar
            -mx-4 px-10  /* 버튼 영역 여백 확보 */
            overflow-x-auto scroll-smooth
            snap-x snap-mandatory whitespace-nowrap
            flex gap-3 py-1
          '
        >
          {tabs.map(([label, value]) => {
            const active = currentTab === value;
            return (
              <button
                key={value}
                role='tab'
                aria-selected={active}
                aria-controls={`tab-panel-${value}`}
                onClick={() => setCurrentTab(value)}
                className={`
                  snap-center shrink-0
                  px-4 py-2 rounded-full text-sm
                  border transition-all
                  ${
                    active
                      ? 'bg-blue-20 text-white border-blue-20 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
