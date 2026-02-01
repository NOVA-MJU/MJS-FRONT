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
  floorsInfo?: { floor: string; description: string }[];
};

/**
 * 명지도 컴포넌트
 */
const CampusMap = () => {
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

  // 건물 정보
  const buildingInfo: BuildingInfo = {
    id: 'inmun',
    name: '인문캠퍼스',
    campus: '캠퍼스',
    building: '건물',
    floors: '1~10',
    rooms: '01~',
    floorsInfo: [
      { floor: '1F', description: '장소 정보 내용' },
      { floor: '2F', description: '장소 정보 내용' },
      { floor: '3F', description: '장소 정보 내용' },
      { floor: '4F', description: '장소 정보 내용' },
      { floor: '10F', description: '대강당 채플관 위치...' },
    ],
  };

  return (
    <div className='relative h-full overflow-hidden bg-white'>
      {/* 지도 이미지 영역 (줌/팬 지원) - 부모 컨테이너를 가득 채우도록 수정 */}
      <div className='absolute inset-0 overflow-hidden'>
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
          className='fixed right-4 bottom-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-105'
          aria-label='건물 목록 열기'
        >
          <img src='/img/mapIcon.png' alt='지도 아이콘' className='h-8 w-8' />
        </button>
      </div>

      {/* 하단 건물 정보 카드  */}
      <div
        className={`fixed right-0 bottom-0 left-0 z-[100] flex flex-col rounded-t-[20px] bg-white p-5 shadow-[0_-4px_8px_rgba(23,23,27,0.14)] transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[60dvh]' : 'max-h-[220px]'
        }`}
      >
        {/* 상단 핸들 및 헤더 클릭 시 토글 */}
        <div className='mb-4 cursor-pointer pt-2' onClick={toggleSheet}>
          <div className='bg-grey-10 mx-auto mb-4 h-1 w-10 rounded-full' />

          {/* 메인 정보 */}
          <div className='flex items-center gap-[14px]'>
            <div className='border-blue-20 bg-blue-15 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border'>
              <img
                src='/img/school-icon.png'
                alt='학교 아이콘'
                className='h-7 w-7 object-contain'
              />
            </div>
            <div className='flex flex-col gap-0.5'>
              <span className='text-body05 text-grey-40 leading-tight'>{buildingInfo.campus}</span>
              <h1 className='text-title02 leading-tight font-semibold text-black'>
                {buildingInfo.name}
              </h1>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className='bg-grey-02 mb-4 h-px w-full' />

        {/* 상세 정보 테이블 */}
        <div className='no-scrollbar flex justify-start gap-2.5 overflow-x-auto'>
          {[
            { value: 'S', label: '캠퍼스' },
            { value: buildingInfo.floors, label: '건물' },
            { value: '3', label: '층' },
            { value: buildingInfo.rooms, label: '강의실' },
          ].map((item, index) => (
            <div key={index} className='flex flex-col items-center gap-2'>
              <div className='bg-blue-05 flex h-8 items-center justify-center px-2'>
                <span className='text-title03 font-bold text-black'>{item.value}</span>
              </div>
              <span className='text-body06 text-grey-30 text-center'>{item.label}</span>
            </div>
          ))}
        </div>

        {/* 층별 상세 정보 리스트 */}
        <div
          className={`no-scrollbar flex flex-col gap-5 overflow-y-auto transition-all duration-300 ${
            isExpanded ? 'opacity-100' : 'pointer-events-none h-0 opacity-0'
          }`}
        >
          {buildingInfo.floorsInfo?.map((info, idx) => (
            <div key={idx} className='flex items-center gap-4'>
              <div className='relative flex h-8 w-10 items-center justify-start'>
                <span className='text-body02 text-blue-35 italic-skew font-bold italic'>
                  {info.floor}
                </span>
                <div className='bg-blue-15 absolute -bottom-1 left-4 h-[12px] w-[2px] rotate-45' />
              </div>
              <span className='text-body03 text-black'>{info.description}</span>
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
