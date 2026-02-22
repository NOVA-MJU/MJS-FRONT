/**
 * 인문캠퍼스 명지도 핀 좌표 데이터 (단위: %)
 */
export const BUILDING_PINS = [
  { id: 'S1', value: '1', left: 38.64, top: 38.83 }, // 종합관
  { id: 'S2', value: '2', left: 60.43, top: 44.17 }, // 본관
  { id: 'S3', value: '3', left: 18.41, top: 30.17 }, // 학생회관
  { id: 'S4', value: '4', left: 74.21, top: 23.17 }, // 명신관
  { id: 'S5', value: '5', left: 78.52, top: 62.5 }, // 다목적관
  { id: 'S8', value: '8', left: 56.48, top: 18.33 }, // 예술관
  { id: 'S9', value: '9', left: 86.89, top: 33.33 }, // 잔디구장
  { id: 'S10', value: '10', left: 11.48, top: 52 }, // 운동장
] as const;

export const ENTRANCE_PINS = [
  { id: 'entrance-1', left: 52.95, top: 28.67 }, // 예술관 근처
  { id: 'entrance-2', left: 95.39, top: 16.17 }, // 우측 상단
  { id: 'entrance-3', left: 6.82, top: 30.33 }, // 좌측 중앙
  { id: 'entrance-4', left: 8.18, top: 86.83 }, // 좌측 하단
  { id: 'entrance-5', left: 55.91, top: 91.33 }, // 하단 중앙
] as const;
