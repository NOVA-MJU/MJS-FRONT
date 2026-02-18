import { type Building } from '@/constants/map';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import MapSidebar from './map-sidebar';

/**
 * 명지도 컴포넌트
 */
const CampusMap = ({ isActive }: { isActive?: boolean }) => {
  // 사이드바 열림/닫힘 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 지도 초기화 완료 상태 관리
  const [isMapReady, setIsMapReady] = useState(false);
  // 하단 시트 확장 상태 관리
  const [isExpanded, setIsExpanded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // 하단 시트 토글 함수
  const toggleSheet = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pinchZoomRef = useRef<any>(null);

  // 초기 줌 설정 함수
  const setInitialZoom = useCallback(() => {
    if (pinchZoomRef.current) {
      console.log('Setting initial zoom');
      // 레이아웃이 안정화될 때까지 잠시 대기 후 설정
      setTimeout(() => {
        pinchZoomRef.current.scaleTo({
          x: 0,
          y: 0,
          scale: 2.8,
          animated: false,
        });
        // 줌 설정이 완료되면 지도를 보이게 처리
        setIsMapReady(true);
      }, 50);
    }
  }, []);

  // 컴포넌트 마운트 및 이미지 로드 시 초기 배율 설정
  useEffect(() => {
    // 이미지가 이미 로드된 경우 즉시 설정
    if (imgRef.current?.complete) {
      setInitialZoom();
    }
  }, [setInitialZoom]);

  const onUpdate = useCallback(({ x, y, scale }: { x: number; y: number; scale: number }) => {
    if (mapRef.current) {
      const value = make3dTransformValue({ x, y, scale });
      mapRef.current.style.setProperty('transform', value);
    }
  }, []);

  // 선택된 건물 정보 상태 관리
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  // 건물 선택 핸들러
  const handleBuildingSelect = useCallback((building: Building) => {
    setSelectedBuilding(building);
    setIsSidebarOpen(false);
    setIsExpanded(true); // 정보창 펼치기
  }, []);

  // 표시할 건물 정보 (기본값 설정 - 타입 오류 방지를 위해 명시적 타입 지정)
  const displayInfo: Building =
    (selectedBuilding as Building) ||
    ({
      name: '인문캠퍼스',
      category: '건물',
      subItems: [
        { location: 'F10', name: '대강당(채플관)' },
        { location: 'F5-6', name: '생활관 연결 통로' },
        { location: 'F4', name: '편의점(emart24)' },
        { location: 'F2', name: '학관 구름다리(학생회관 4층 연결)' },
        { location: 'F1', name: '프린터, 증명서 발급기' },
      ],
    } as unknown as Building);

  // 탭이 변경되어 비활성화될 때 사이드바 닫기
  useEffect(() => {
    if (!isActive) {
      setIsSidebarOpen(false);
    }
  }, [isActive]);

  return (
    <div className='relative h-full overflow-hidden bg-white'>
      {/* 지도 이미지 영역 (줌/팬 지원) - 부모 컨테이너를 가득 채우도록 수정 */}
      <div className='absolute inset-0 z-0 overflow-hidden'>
        <QuickPinchZoom
          ref={pinchZoomRef}
          onUpdate={onUpdate}
          wheelScaleFactor={0.005}
          draggableUnZoomed={true}
          containerProps={{ className: 'h-full' }}
          enforceBoundsDuringZoom={true}
          inertia={true}
        >
          <div
            ref={mapRef}
            className={`flex h-fit w-fit flex-col items-center transition-opacity duration-300 will-change-transform ${
              isMapReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              ref={imgRef}
              src='/img/school_map.png'
              alt='명지대학교 캠퍼스 지도'
              className='pointer-events-none block h-[calc(100dvh-99px)] w-auto max-w-none'
              onLoad={() => {
                setInitialZoom();
              }}
            />
            {/* 하단 정보창(바텀 시트) 여백 제거 (스크롤 방지) */}
          </div>
        </QuickPinchZoom>
      </div>

      {/* 하단 건물 정보 카드  */}
      <div
        className={`fixed right-0 bottom-0 left-0 z-[100] flex flex-col rounded-t-[20px] bg-white px-5 pt-0 pb-10 shadow-[0_-4px_8px_rgba(23,23,27,0.14)] transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[60dvh]' : 'max-h-[220px]'
        }`}
      >
        {/* 상단 핸들 및 헤더 클릭 시 토글 */}
        <div className='mb-4 cursor-pointer pt-0' onClick={toggleSheet}>
          <div className='bg-grey-10 mx-auto mt-4 mb-4 h-1 w-10 rounded-full' />

          {/* 메인 정보 */}
          <div className='flex items-center gap-[14px]'>
            <div className='border-blue-20 bg-blue-15 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border'>
              <img
                src={
                  displayInfo.category === '건물'
                    ? '/img/building-icon.png'
                    : displayInfo.category === '편의시설'
                      ? '/img/shop-icon.png'
                      : '/img/school-icon.png'
                }
                alt='카테고리 아이콘'
                className='h-7 w-7 object-contain'
              />
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-body05 text-grey-40 leading-tight'>
                {displayInfo.category || '캠퍼스'}
              </span>
              <h1 className='text-title02 leading-tight font-semibold text-black'>
                {displayInfo.name}
              </h1>
            </div>
          </div>
        </div>
        {/* 구분선 */}
        <div className='bg-grey-02 mb-4 h-px w-full' />

        {/* 건물 카테고리일 때만 표시되는 S1~S4 정보 블록 */}
        {displayInfo.category === '건물' && (
          <div className='mb-6 flex gap-2'>
            {[
              { label: '캠퍼스', value: 'S' },
              { label: '건물', value: '1~10' },
              { label: '층', value: '3' },
              { label: '강의실', value: '01~' },
            ].map((item, idx) => (
              <div key={idx} className='flex flex-col items-center gap-1.5'>
                <div className='bg-blue-05 text-title02 flex h-[38px] min-w-[50px] items-center justify-center px-2'>
                  {item.value}
                </div>
                <span className='text-body05 text-grey-40'>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* 상세 정보 리스트 (subItems) */}
        <div
          className={`no-scrollbar grid grid-cols-[max-content_1fr] gap-x-4 gap-y-5 overflow-y-auto pb-2 transition-all duration-300 ${
            isExpanded ? 'opacity-100' : 'pointer-events-none h-0 opacity-0'
          }`}
        >
          {displayInfo.subItems?.map((info, idx) => (
            <div key={idx} className='contents'>
              <div className='flex items-start gap-1 pt-0.5'>
                <span className='text-body02 text-blue-35 italic-skew font-bold italic'>
                  {info.location}
                </span>
                <div className='bg-blue-15 mt-4 h-[10px] w-[1px] rotate-45' />
              </div>
              <div className='flex flex-col'>
                <span className='text-body03 text-black'>{info.name}</span>
                {info.description && (
                  <span className='text-grey-40 text-[10px]'>{info.description}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 지도 목록 버튼 */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className='absolute top-2 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-all active:scale-95'
        aria-label='건물 목록 열기'
      >
        <img src='/img/mapIcon.png' alt='지도 아이콘' className='h-7 w-7' />
      </button>

      {/* 사이드바 (Portal 사용으로 Swiper 스택 탈출) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <MapSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onBuildingSelect={handleBuildingSelect}
            selectedBuildingId={selectedBuilding?.id}
          />,
          document.body,
        )}
    </div>
  );
};

export default CampusMap;
