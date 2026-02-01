import { useState, useMemo } from 'react';
import { MAP_DATA, type Building, type BuildingCategory } from '@/constants/map';

type SidebarSection = BuildingCategory | 'CAMPUS';

type MapSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onBuildingSelect?: (building: Building) => void;
};

const CATEGORY_ORDER: BuildingCategory[] = ['건물', '캠퍼스 시설', '편의시설', '기타'];

/**
 * 지도 사이드바 컴포넌트
 */
const MapSidebar = ({ isOpen, onClose, onBuildingSelect }: MapSidebarProps) => {
  // 현재 첫 번째 캠퍼스 데이터를 명시적으로 사용
  const currentCampusData = MAP_DATA.campuses[0];
  const selectedCampus = currentCampusData.name;

  const [expandedCategories, setExpandedCategories] = useState<Set<SidebarSection>>(
    new Set(['CAMPUS', '건물']),
  );

  // 선택된 캠퍼스의 건물들을 카테고리별로 그룹화 (최적화)
  const buildingsByCategory = useMemo(() => {
    return currentCampusData.buildings.reduce(
      (acc, building) => {
        if (!acc[building.category]) {
          acc[building.category] = [];
        }
        acc[building.category].push(building);
        return acc;
      },
      {} as Record<BuildingCategory, Building[]>,
    );
  }, [currentCampusData.buildings]);

  // 카테고리 토글 핸들러
  const toggleCategory = (category: SidebarSection) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // 건물 선택 핸들러
  const handleBuildingClick = (building: Building) => {
    onBuildingSelect?.(building);
  };

  return (
    <>
      {/* 배경 오버레이 */}
      {isOpen && (
        <div
          className='fixed top-[90px] right-0 bottom-0 left-0 z-40 bg-black/50'
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`fixed top-[100px] right-0 bottom-0 z-50 w-[280px] transform bg-white shadow-xl transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 헤더 */}
        <div className='flex items-center justify-end p-4'>
          <button
            onClick={onClose}
            className='text-grey-40 hover:text-grey-60 transition-colors'
            aria-label='사이드바 닫기'
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M18 6L6 18M6 6L18 18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>

        {/* 컨텐츠 영역 */}
        <div className='flex flex-col overflow-y-auto pb-5'>
          {/* 섹션 목록 */}
          <div className='flex-1 space-y-0'>
            {/* 캠퍼스 섹션 */}
            <div key='campus-section' className='px-5 py-6'>
              <div className='mb-3 flex items-center justify-between'>
                <h2 className='text-body02 text-mju-primary'>{MAP_DATA.titles.CAMPUS}</h2>
                <button
                  onClick={() => toggleCategory('CAMPUS')}
                  className='text-grey-30 hover:text-grey-50 -mr-2 p-2 transition-colors'
                >
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    style={{
                      transform: expandedCategories.has('CAMPUS')
                        ? 'rotate(0deg)'
                        : 'rotate(-90deg)',
                      transition: 'transform 0.15s ease',
                    }}
                  >
                    <path
                      d='M6 9L12 15L18 9'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>
              {expandedCategories.has('CAMPUS') && (
                <div className='mt-1 ml-3 space-y-1'>
                  <div className='text-body05 px-3 py-2'>{selectedCampus}</div>
                </div>
              )}
            </div>

            {/* 건물 카테고리별 섹션 */}
            {CATEGORY_ORDER.map((category) => {
              const buildings = buildingsByCategory[category];
              if (!buildings || buildings.length === 0) return null;

              return (
                <div key={category} className='border-grey-02 border-t py-6'>
                  <div className='mb-3 flex items-center justify-between px-5'>
                    <h2 className='text-body02 text-mju-primary'>{category}</h2>
                    <button
                      onClick={() => toggleCategory(category)}
                      className='text-grey-30 hover:text-grey-50 -mr-2 p-2 transition-colors'
                    >
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        style={{
                          transform: expandedCategories.has(category)
                            ? 'rotate(0deg)'
                            : 'rotate(-90deg)',
                          transition: 'transform 0.15s ease',
                        }}
                      >
                        <path
                          d='M6 9L12 15L18 9'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                  </div>

                  {/* 건물 목록 */}
                  {expandedCategories.has(category) && (
                    <div className='mt-1 space-y-1 px-8'>
                      {buildings.map((building) => (
                        <button
                          key={building.id}
                          onClick={() => handleBuildingClick(building)}
                          className='text-body05 text-grey-50 hover:bg-blue-02 hover:text-mju-primary w-full rounded px-3 py-2 text-left transition-colors'
                        >
                          {building.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MapSidebar;
