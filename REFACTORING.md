# 리팩토링 작업 문서

이 문서는 프로젝트의 주요 리팩토링 작업 내역을 기록합니다.

## 📋 목차

1. [React.FC 및 명시적 반환 타입 제거](#1-reactfc-및-명시적-반환-타입-제거)
2. [불필요한 코드 정리](#2-불필요한-코드-정리)
3. [매직 스트링/넘버 상수화](#3-매직-스트링넘버-상수화)
4. [에러 처리 로직 통합](#4-에러-처리-로직-통합)
5. [타입 안정성 개선](#5-타입-안정성-개선)

---

## 1. React.FC 및 명시적 반환 타입 제거

### 목적

TypeScript의 타입 추론을 활용하여 코드를 간결하게 만들고, React.FC의 제한사항을 피하기 위함

### 변경 사항

- 모든 컴포넌트에서 `React.FC` 제거
- 명시적 `JSX.Element` 반환 타입 제거
- TypeScript의 암시적 타입 추론 활용

### 예시

**이전:**

```typescript
const MyComponent: React.FC<Props> = ({ name }): JSX.Element => {
  return <div>{name}</div>;
};
```

**이후:**

```typescript
const MyComponent = ({ name }: Props) => {
  return <div>{name}</div>;
};
```

### 영향 범위

- 모든 컴포넌트 파일 (atoms, molecules, organisms, pages)

---

## 2. 불필요한 코드 정리

### 2.1 불필요한 주석 제거

- JSDoc 주석 중 중복되거나 불필요한 내용 제거
- TODO 주석 정리
- 자명한 코드에 대한 주석 제거

### 2.2 React import 정리

- 새로운 JSX Transform으로 인해 불필요한 `import React from 'react'` 제거
- React 17+ 버전의 자동 JSX 변환 활용

### 2.3 테스트 페이지 삭제

- `src/components/atoms/Input/InputTestPage.tsx` 삭제
- `src/components/atoms/Button/ButtonTestPage.tsx` 삭제

---

## 3. 매직 스트링/넘버 상수화

### 목적

하드코딩된 값들을 상수로 분리하여 유지보수성과 일관성 향상

### 생성된 파일

`src/constants/common.ts`

### 정의된 상수

#### 이메일 도메인

```typescript
export const EMAIL_DOMAIN = '@mju.ac.kr';
export const EMAIL_DOMAIN_FULL = 'mju.ac.kr';
```

#### 페이지네이션

```typescript
export const DEFAULT_PAGE_SIZE = 10;
export const BOARD_PAGE_SIZE = 10;
export const BROADCAST_PAGE_SIZE = 9;
export const NOTICE_PAGE_SIZE = 10;
export const NEWS_MOBILE_PAGE_SIZE = 5;
export const NEWS_DESKTOP_PAGE_SIZE = 8;
export const COMMON_LIST_ITEMS_PER_PAGE = 8;
export const NOTICE_API_DEFAULT_SIZE = 8;
export const CALENDAR_API_DEFAULT_SIZE = 100;
export const SEARCH_API_DEFAULT_SIZE = 10;
```

#### 시간 관련 (밀리초)

```typescript
export const MENU_STALE_TIME_MS = 5 * 60 * 1000; // 5분
export const REALTIME_RANK_INTERVAL_MS = 10000; // 10초
export const AD_CAROUSEL_INTERVAL_MS = 4000; // 4초
```

#### 아이콘 사이즈

```typescript
export const ICON_SIZE_SM = 12;
export const ICON_SIZE_MD = 16;
export const ICON_SIZE_LG = 20;
export const ICON_SIZE_XL = 22;
```

#### 이미지 관련

```typescript
export const IMAGE_MAX_WIDTH_OR_HEIGHT = 1920;
export const IMAGE_COMPRESSION_QUALITY = 0.9;
```

### 적용된 파일

- `utils/email.ts`: 이메일 도메인 상수 적용
- `pages/board/*`, `pages/broadcast/*`, `pages/notice/*`, `pages/news/*`: 페이지 사이즈 상수 적용
- `api/*`: API 기본값 상수 적용
- `components/molecules/sections/*`: 아이콘 사이즈 상수 적용
- `hooks/useRegister.ts`: 이미지 관련 상수 적용

---

## 4. 에러 처리 로직 통합

### 목적

분산된 에러 처리 로직을 통합하여 일관성 있는 에러 처리 제공

### 생성된 파일

- `src/utils/error.ts`: 공통 에러 처리 유틸리티
- `src/types/error.ts`: 에러 타입 정의

### 주요 함수

#### `extractErrorMessage(error, fallback)`

에러 객체에서 메시지를 추출합니다.

- 우선순위: `response.data.message` → `response.data.status` → `error.message` → `fallback`

#### `handleError(error, fallback, options)`

에러를 처리하고 사용자에게 알림을 표시합니다.

- 개발 환경에서만 콘솔 로깅
- Toast 알림 표시 (옵션)

#### `getErrorMessage(error, fallback)`

에러 메시지만 추출합니다 (상태 관리용).

#### `handleErrorWithStatus(error, statusMessages, fallback)`

HTTP 상태 코드별로 다른 메시지를 표시합니다.

### 타입 가드 함수

#### `isAxiosErrorResponse(error)`

AxiosError인지 확인합니다.

#### `isDuplicateNicknameError(error)`

닉네임 중복 에러인지 확인합니다.

### 적용된 파일

- `hooks/useRegister.ts`: 로컬 `handleError` 제거, 공통 함수 사용
- `hooks/useFindPw.ts`: `toErrMsg` 제거, `getErrorMessage` 사용
- `components/organisms/LoginForm/index.tsx`: `handleErrorWithStatus` 사용
- 모든 페이지 및 컴포넌트: `console.error` → `handleError`로 통합

### 예시

**이전:**

```typescript
try {
  await someApiCall();
} catch (error) {
  const axiosError = error as AxiosError<{ message: string }>;
  console.error(axiosError?.response?.data?.message || '에러 발생');
  toast.error(axiosError?.response?.data?.message || '에러 발생');
}
```

**이후:**

```typescript
try {
  await someApiCall();
} catch (error) {
  handleError(error, '요청에 실패했습니다.');
}
```

---

## 5. 타입 안정성 개선

### 목적

`any` 타입을 제거하고 구체적인 타입을 사용하여 타입 안정성 향상

### 생성된 타입

#### `AxiosErrorResponseData`

```typescript
interface AxiosErrorResponseData {
  message?: string;
  status?: string | number;
  error?: string;
}
```

#### `DuplicateNicknameErrorResponse`

```typescript
interface DuplicateNicknameErrorResponse {
  status?: number;
  error?: string;
  message?: string;
}
```

### 개선 사항

#### `useRegister.ts`

**이전:**

```typescript
const ax = err as AxiosError<{ status?: number; error?: string; message?: string }>;
if (ax.response?.status === 400 && ax.response?.data?.error === 'DUPLICATE_NICKNAME') {
  // ...
}
```

**이후:**

```typescript
if (isDuplicateNicknameError(err)) {
  // 타입 안전하게 처리
}
```

### console.log/error 정리

- 불필요한 디버깅용 `console.log` 제거
- `console.error`를 `handleError`로 통합
- 개발 환경에서만 필요한 로깅은 `handleError` 내부에서 처리

---

## 📊 통계

### 변경된 파일 수

- React.FC 제거: 50+ 파일
- 상수 분리: 25+ 파일
- 에러 처리 통합: 20+ 파일
- 타입 안정성 개선: 15+ 파일

### 코드 변경량

- 총 추가: 약 500+ 줄
- 총 삭제: 약 300+ 줄
- 순 증가: 약 200+ 줄

---

## 🎯 개선 효과

### 코드 품질

- ✅ 타입 안정성 향상
- ✅ 코드 일관성 향상
- ✅ 유지보수성 향상
- ✅ 가독성 향상

### 개발 경험

- ✅ 자동완성 개선
- ✅ 타입 체크 강화
- ✅ 에러 처리 통일
- ✅ 상수 관리 중앙화

### 성능

- ✅ 불필요한 코드 제거
- ✅ 번들 크기 최적화 (미미한 수준)

---

## 📝 참고 사항

### 커밋 내역

- `6626b01`: 매직 스트링 및 매직 넘버를 상수로 분리
- `3fd70a3`: 에러 처리 로직 통합 및 문서화
- `283e98b`: console.log/error 정리 및 타입 안정성 개선

### 다음 단계 권장 사항

1. 검증 로직 통합 (`utils/validation.ts`)
2. React Query 마이그레이션 확대
3. 인라인 스타일 Tailwind CSS 전환 (선택적)

---

## 🔗 관련 파일

- `src/constants/common.ts`: 공통 상수 정의
- `src/utils/error.ts`: 에러 처리 유틸리티
- `src/types/error.ts`: 에러 타입 정의

---

**작성일**: 2024년  
**최종 업데이트**: 리팩토링 작업 완료 시점
