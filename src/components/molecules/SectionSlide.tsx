import type { ReactNode } from 'react';

/**
 * 섹션 슬라이드 Props
 */
interface SectionSlideProps {
  title: string;
  children: ReactNode;
  backgroundColor?: string;
}

/**
 * 메인 캐로셀의 각 슬라이드 섹션 컴포넌트
 *
 * 좌우 스와이프로 전환되는 각 섹션을 담는 컨테이너입니다.
 * - 일관된 레이아웃 제공
 * - 제목과 컨텐츠 영역 분리
 * - 스크롤 가능한 컨텐츠 영역
 *
 * @example
 * <SectionSlide title="공지사항">
 *   <NoticeSection />
 * </SectionSlide>
 */
export default function SectionSlide({
  title,
  children,
  backgroundColor = 'bg-blue-05',
}: SectionSlideProps) {
  return (
    <div className={`flex h-full w-full flex-col ${backgroundColor}`}>
      {/* 섹션 헤더 */}
      <div className='bg-blue-35 px-6 py-4 shadow-sm'>
        <h2 className='text-title01 text-white'>{title}</h2>
      </div>

      {/* 섹션 컨텐츠 (스크롤 가능) */}
      <div className='flex-1 overflow-y-auto px-4 py-6'>{children}</div>
    </div>
  );
}
