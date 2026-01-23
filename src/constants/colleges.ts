export const COLLEGE_OPTIONS = [
  { label: '인문대학', value: 'HUMANITIES' },
  { label: '사회과학대학', value: 'SOCIAL_SCIENCES' },
  { label: '경영대학', value: 'BUSINESS' },
  { label: '미디어·휴먼라이프대학', value: 'MEDIA_HUMANLIFE' },
  { label: '인공지능·소프트웨어융합대학', value: 'AI_SOFTWARE' },
  { label: '미래융합대학', value: 'FUTURE_CONVERGENCE' },
  { label: '아너칼리지(전공자유대학)', value: 'HONOR' },
];

/**
 * value를 입력하면 label을 반환하는 함수입니다.
 *
 * `사용예시`
 *
 * ```javascript
 * collegeMap.get(collegeName)
 * ```
 */
export const collegeMap = new Map(COLLEGE_OPTIONS.map((option) => [option.value, option.label]));
