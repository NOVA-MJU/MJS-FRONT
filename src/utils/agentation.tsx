import { Agentation } from 'agentation';

/**
 * Agentation 개발 도구 컴포넌트
 *
 * 웹페이지 요소에 주석을 달아 AI 에이전트(Cursor, Claude Code 등)에게
 * 정확한 피드백을 전달하는 도구입니다.
 *
 * - 개발 환경에서만 활성화됨
 * - 우측 하단 툴바로 제공됨
 * - React Portal로 body에 렌더링되어 모든 페이지에서 접근 가능
 *
 * @see https://agentation.dev/
 */
export const AgentationTool = () => {
  // 배포 환경에서는 렌더링하지 않음
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Agentation
      // 클립보드 자동 복사 활성화
      copyToClipboard={true}
      // 복사 시 콘솔 로그 (디버깅용)
      onCopy={(markdown) => {
        console.log('📋 Agentation 주석이 복사되었습니다');
        console.log(markdown);
      }}
      // 주석 추가 시 로그
      onAnnotationAdd={(annotation) => {
        console.log(' 주석 추가:', {
          element: annotation.element,
          comment: annotation.comment,
          cssClasses: annotation.cssClasses,
        });
      }}
      // 주석 삭제 시 로그
      onAnnotationDelete={(annotation) => {
        console.log(' 주석 삭제:', annotation.element);
      }}
      // 주석 수정 시 로그
      onAnnotationUpdate={(annotation) => {
        console.log(' 주석 수정:', annotation.element);
      }}
      // 전체 클리어 시 로그
      onAnnotationsClear={(annotations) => {
        console.log(' 모든 주석 클리어:', annotations.length, '개');
      }}
    />
  );
};
