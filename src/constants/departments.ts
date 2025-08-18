export const DEPARTMENT_OPTIONS = [
  { label: '인문대학', value: 'HUMANITIES_COLLEGE' },
  { label: '중어중문학과', value: 'CHINESE_LITERATURE' },
  { label: '일어일문학과', value: 'JAPANESE_LITERATURE' },
  { label: '아랍지역학과', value: 'ARABIC_STUDIES' },
  { label: '글로벌한국어학', value: 'KOREAN_STUDIES' },
  { label: '문예창작학과', value: 'CREATIVE_WRITING' },
  { label: '국어국문학과', value: 'KOREAN_LITERATURE' },
  { label: '영어영문학과', value: 'ENGLISH_LITERATURE' },
  { label: '미술사, 역사학과', value: 'ART_HISTORY' },
  { label: '문헌정보학과', value: 'LIBRARY_SCIENCE' },
  { label: '글로벌문화콘텐츠학전공', value: 'CULTURAL_CONTENT_STUDIES' },
  { label: '철학과', value: 'PHILOSOPHY' },

  { label: '사회과학대학', value: 'SOCIAL_SCIENCES' },
  { label: '행정학과', value: 'PUBLIC_ADMINISTRATION' },
  { label: '정치외교학과', value: 'POLITICAL_DIPLOMACY' },
  { label: '법학과', value: 'LAW' },
  { label: '경제학과', value: 'ECONOMICS' },
  { label: '국제통상학전공', value: 'INTERNATIONAL_TRADE' },
  { label: '응용통계학과', value: 'APPLIED_STATISTICS' },

  { label: '경영대', value: 'BUSINESS' },
  { label: '경영학과', value: 'BUSINESS_ADMINISTRATION' },
  { label: '글로벌비즈니스학과', value: 'GLOBAL_BUSINESS_STUDIES' },
  { label: '경영정보학과', value: 'MANAGEMENT_INFORMATION_SYSTEMS' },

  { label: '미휴라', value: 'MEDIA_HUMANLIFE' },
  { label: '디지털미디어학부', value: 'DIGITAL_MEDIA_STUDIES' },
  { label: '청소년지도학과', value: 'YOUTH_GUIDANCE_STUDIES' },
  { label: '아동학과', value: 'CHILD_STUDIES' },

  { label: '인공지능소프트웨어융합대학', value: 'AI_SOFTWARE' },
  { label: '융합소프트웨어학부', value: 'CONVERGENT_SOFTWARE_STUDIES' },
  { label: '디지털콘텐츠디자인학과', value: 'DIGITAL_CONTENT_DESIGN_STUDIES' },
  { label: '데이터사이언스학과', value: 'DATA_SCIENCE' },
  { label: '응용소프트웨어학과', value: 'APPLICATION_SOFTWARE' },

  { label: '미융대', value: 'FUTURE_CONVERGENCE' },
  { label: '아너칼리지(자유전공학부)', value: 'HONOR' },
  { label: '기타', value: 'OTHER' },
];

/**
 * value를 입력하면 label을 반환하는 함수입니다.
 *
 * `사용예시`
 *
 * ```javascript
 * departmentMap.get(departmentName)
 * ```
 */
export const departmentMap = new Map(
  DEPARTMENT_OPTIONS.map((option) => [option.value, option.label]),
);
