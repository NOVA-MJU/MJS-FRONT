import { useState, useCallback, useRef, useEffect } from 'react';
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom';
import MapSidebar from './map-sidebar';

/**
 * 건물 정보 타입 정의
 */
type BuildingInfo = {
  id: string;
  name: string;
  campus: string;
  building: string;
  floors: string;
  rooms: string;
};

/**
 * 명지도 컴포넌트
 */
const CampusMap = () => {
  // 사이드바 열림/닫힘 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 지도 초기화 완료 상태 관리
  const [isMapReady, setIsMapReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

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

  // 건물 정보
  const buildingInfo: BuildingInfo = {
    id: 'inmun',
    name: '인문캠퍼스',
    campus: '캠퍼스',
    building: '건물',
    floors: '1~10',
    rooms: '01~',
  };

  return (
    <div className='flex h-full flex-col overflow-hidden bg-white'>
      {/* 지도 이미지 영역  */}
      <div className='relative flex-1 overflow-hidden'>
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
            className={`flex h-full w-fit items-start justify-center transition-opacity duration-300 will-change-transform ${
              isMapReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              ref={imgRef}
              src='/img/school_map.png'
              alt='명지대학교 캠퍼스 지도'
              className='pointer-events-none h-full w-auto max-w-none'
              onLoad={() => {
                setInitialZoom();
              }}
            />
          </div>
        </QuickPinchZoom>

        {/* 지도 목록 버튼 */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className='absolute top-4 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-105'
          aria-label='건물 목록 열기'
        >
          <img src='/img/mapIcon.png' alt='지도 아이콘' className='h-8 w-8' />
        </button>
      </div>

      {/* 하단 건물 정보 카드 */}
      <div className='z-50 rounded-t-[20px] bg-white px-5 pt-4 pb-10 shadow-[0_-4px_8px_rgba(23,23,27,0.14)]'>
        {/* 상단 핸들 */}
        <div className='bg-grey-10 mx-auto mb-4 h-1 w-10 rounded-full' />

        {/* 메인 정보 */}
        <div className='mb-4 flex items-center gap-[14px]'>
          <div className='bg-blue-15 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[6px]'>
            <img src='/img/school-icon.png' alt='학교 아이콘' className='h-7 w-7 object-contain' />
          </div>
          <div className='flex flex-col gap-0.5'>
            <span className='text-body05 text-grey-40 leading-tight'>{buildingInfo.campus}</span>
            <h1 className='text-title02 leading-tight font-semibold text-black'>
              {buildingInfo.name}
            </h1>
          </div>
        </div>

        {/* 구분선 */}
        <div className='bg-grey-02 mb-4 h-px w-full' />

        {/* 상세 정보 테이블 */}
        <div className='flex gap-2.5'>
          {[
            { value: 'S', label: '캠퍼스' },
            { value: buildingInfo.floors, label: '건물' },
            { value: '3', label: '층' },
            { value: buildingInfo.rooms, label: '강의실' },
          ].map((item, index) => (
            <div key={index} className='flex flex-1 flex-col items-center gap-2'>
              <div className='bg-blue-05 flex h-[50px] w-full items-center justify-center rounded-[4px]'>
                <span className='text-title02 font-semibold text-black'>{item.value}</span>
              </div>
              <span className='text-body05 text-grey-40 text-center'>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 사이드바 */}
      <MapSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

export default CampusMap;
