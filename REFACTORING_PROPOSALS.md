# 추가 리팩토링 제안 사항

이 문서는 useQuery 마이그레이션을 제외한 추가 리팩토링 가능 항목을 정리합니다.

## 목차

1. [검증 로직 통합](#1-검증-로직-통합-완료)
2. [API 파일의 console.error 정리](#2-api-파일의-consoleerror-정리-완료)
3. [인라인 스타일 하드코딩 값 정리](#3-인라인-스타일-하드코딩-값-정리-완료)
4. [@deprecated 컴포넌트 정리](#4-deprecated-컴포넌트-정리-우선순위-낮음)
5. [중복된 useEffect 패턴 개선](#5-중복된-useeffect-패턴-개선-우선순위-낮음)
6. [불필요한 console.log 제거](#6-불필요한-consolelog-제거-완료)

---

## 1. 검증 로직 통합 (완료)

**완료일**: 2026년 1월 2일  
**커밋**: `90e7143`

### 문제점

검증 로직이 여러 파일에 중복되어 있습니다.

#### 비밀번호 검증

- **위치**: `src/components/organisms/Register/index.tsx`
- **패턴**: `/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,16}$/`
- **사용**: 회원가입 폼에서 비밀번호 유효성 검사

#### 학번 검증

- **위치**:
  - `src/components/organisms/Register/index.tsx`
  - `src/components/molecules/user/StudentCodeFieldWithVerify/index.tsx`
- **패턴**: `/^60\d{6}$/`
- **사용**: 회원가입 폼, 학번 입력 필드

#### 이메일 검증

- **위치**:
  - `src/components/organisms/LoginForm/index.tsx`
  - `src/components/organisms/FindForm/FindIdForm.tsx`
- **패턴**:
  - `LoginForm`: `/^[\w.-]+@mju\.ac\.kr$/`
  - `FindIdForm`: `/@mju\.ac\.kr$/i`
- **사용**: 로그인, 아이디 찾기

### 해결 방안

`src/utils/validation.ts` 파일 생성

```typescript
import { EMAIL_DOMAIN } from '../constants/common';

/**
 * 비밀번호 유효성 검사
 * - 8~16자
 * - 영문, 숫자, 특수문자 각각 1개 이상 포함
 */
export const validatePassword = (password: string): boolean => {
  return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,16}$/.test(password);
};

/**
 * 학번 유효성 검사
 * - 60으로 시작하는 8자리 숫자
 */
export const validateStudentCode = (code: string): boolean => {
  return /^60\d{6}$/.test(code.trim());
};

/**
 * 명지대 이메일 유효성 검사
 * - @mju.ac.kr 도메인 포함
 */
export const validateMjuEmail = (email: string): boolean => {
  const escapedDomain = EMAIL_DOMAIN.replace('.', '\\.');
  return new RegExp(`^[\\w.-]+${escapedDomain}$`).test(email);
};

/**
 * 이메일 도메인 검사 (부분 일치)
 * - 대소문자 구분 없음
 */
export const isMjuEmailDomain = (email: string): boolean => {
  const escapedDomain = EMAIL_DOMAIN.replace('.', '\\.');
  return new RegExp(`${escapedDomain}$`, 'i').test(email);
};
```

### 적용된 파일

- `src/utils/validation.ts` (신규 생성)
- `src/components/organisms/Register/index.tsx`
- `src/components/organisms/LoginForm/index.tsx`
- `src/components/organisms/FindForm/FindIdForm.tsx`

### 완료된 효과

- 검증 로직 일관성 향상
- 유지보수 용이성 증가
- 테스트 용이성 향상
- 코드 중복 제거

---

## 2. API 파일의 console.error 정리 (완료)

**완료일**: 2026년 1월 2일  
**커밋**: `d6196bd`

### 문제점

일부 API 파일에 아직 `console.error`가 남아있습니다.

### 발견된 파일

- `src/api/news.ts`: `console.error('news fetching error', e)`
- `src/api/main/meal-api.ts`: `console.error('식단 정보를 불러오는 중 오류 발생:', e)`
- `src/pages/search/index.tsx`: `console.error(e)`
- `src/pages/mypage/index.tsx`: `console.error('마이페이지 데이터 불러오기 실패', err)`
- `src/components/atoms/SearchBar/index.tsx`: `console.error(e)`, `console.log(domain)`

### 해결 방안

- API 파일의 `console.error`를 제거하거나 `handleError`로 대체
- 디버깅용 `console.log` 제거

### 적용된 파일

- `src/api/news.ts`: 불필요한 try-catch 및 console.error 제거
- `src/api/main/meal-api.ts`: 불필요한 try-catch 및 console.error 제거
- `src/pages/search/index.tsx`: console.error 제거
- `src/pages/mypage/index.tsx`: console.error를 handleError로 대체
- `src/components/atoms/SearchBar/index.tsx`: console.error 및 console.log 제거

### 완료된 효과

- 프로덕션 로그 정리
- 에러 처리 통일
- 코드 간결성 향상

---

## 3. 인라인 스타일 하드코딩 값 정리 (완료)

**완료일**: 2026년 1월 2일  
**커밋**: `466adae`

### 문제점

인라인 스타일에서 하드코딩된 색상 값이 사용되고 있습니다.

### 발견된 하드코딩 값

#### `src/components/atoms/Input/Input.tsx`

- `'#ffffff'` → `colors.white`로 변경 가능
- `'#fee2e2'` → 에러 배경색 (새로운 상수 필요)

#### `src/components/atoms/Button/ButtonActiveStyleMap.ts`

- `'#FFD700'` → 노란색 (sub 버튼)
- `'#E3E6E6'` → `colors.grey10`로 변경 가능
- `'#999999'` → `colors.grey40`로 변경 가능
- `'#17171B'` → `colors.black`로 변경 가능

### 해결 방안

`src/styles/color.ts`에 누락된 색상 추가

```typescript
export const colors = {
  // ... 기존 색상
  yellow: '#FFD700', // sub 버튼용
  errorBackground: '#fee2e2', // 에러 배경색
};
```

### 적용된 파일

- `src/styles/color.ts`: errorBackground, yellow 색상 상수 추가
- `src/components/atoms/Input/Input.tsx`: 하드코딩된 색상 값을 상수로 교체
- `src/components/atoms/Button/ButtonActiveStyleMap.ts`: 하드코딩된 색상 값을 상수로 교체

### 완료된 효과

- 색상 일관성 향상
- 중앙화된 색상 관리
- 유지보수 용이성 증가

---

## 4. @deprecated 컴포넌트 정리 (우선순위: 낮음)

### 문제점

`@deprecated`로 표시된 컴포넌트가 여전히 사용되고 있습니다.

### 발견된 컴포넌트

- `src/components/atoms/Typography/index.tsx`: 34개 파일에서 사용 중
- `src/api/calendar.ts`: `getAcademicEvents` 함수
- `src/components/organisms/CalendarList/index.tsx`
- `src/components/organisms/CalendarGrid/index.tsx`

### 해결 방안

1. **Typography 컴포넌트**:
   - 사용처를 찾아 Tailwind CSS 클래스로 대체
   - 또는 완전히 제거하기 전까지 유지

2. **Calendar 관련 deprecated 함수**:
   - 사용처 확인 후 제거 또는 대체

### 적용 대상

- `src/components/atoms/Typography/index.tsx` (34개 파일에서 사용)
- `src/api/calendar.ts`
- `src/components/organisms/CalendarList/index.tsx`
- `src/components/organisms/CalendarGrid/index.tsx`

---

## 5. 중복된 useEffect 패턴 개선 (우선순위: 낮음)

### 문제점

여러 페이지에서 비슷한 패턴의 `useEffect` + `async` 함수가 반복됩니다.

### 발견된 패턴

```typescript
useEffect(() => {
  (async () => {
    try {
      setIsLoading(true);
      const data = await someApiCall();
      setData(data);
    } catch (e) {
      handleError(e, '에러 메시지', { showToast: false });
    } finally {
      setIsLoading(false);
    }
  })();
}, [dependencies]);
```

### 해결 방안

커스텀 훅으로 추출 (선택적)

```typescript
// hooks/useAsyncEffect.ts
export function useAsyncEffect(asyncFn: () => Promise<void>, dependencies: React.DependencyList) {
  useEffect(() => {
    asyncFn();
  }, dependencies);
}
```

### 적용 대상

- `src/pages/mypage/index.tsx`
- `src/pages/search/index.tsx`
- 기타 비슷한 패턴을 가진 페이지들

---

## 6. 불필요한 console.log 제거 (완료)

**완료일**: 2026년 1월 2일  
**커밋**: `d6196bd`

### 문제점

디버깅용 `console.log`가 남아있습니다.

### 발견된 파일

- `src/components/atoms/SearchBar/index.tsx`: `console.log(domain)`

### 해결 방안

불필요한 `console.log` 제거

### 적용된 파일

- `src/components/atoms/SearchBar/index.tsx`: console.log(domain) 제거

### 완료된 효과

- 프로덕션 로그 정리
- 코드 간결성 향상

---

## 우선순위 요약

### 완료된 작업

1. **검증 로직 통합** - 코드 일관성 및 유지보수성 향상 (완료)
2. **API 파일의 console.error 정리** - 프로덕션 로그 정리 (완료)
3. **인라인 스타일 하드코딩 값 정리** - 색상 일관성 향상 (완료)
4. **불필요한 console.log 제거** - 간단한 정리 (완료)

### 남은 작업 (선택적)

1. **@deprecated 컴포넌트 정리** - 큰 작업, 신중한 접근 필요
   - Typography 컴포넌트: 34개 파일에서 사용 중
   - Calendar 관련 deprecated 함수들
   - 사용처 확인 후 Tailwind CSS로 대체 또는 제거 필요

2. **중복된 useEffect 패턴 개선** - 선택적 개선
   - 비슷한 패턴의 async useEffect를 커스텀 훅으로 추출 가능
   - `src/pages/mypage/index.tsx`, `src/pages/search/index.tsx` 등

---

## 다음 단계 권장 사항

### 즉시 권장하지 않음

- **@deprecated 컴포넌트 정리**: 큰 작업이며 기존 코드에 광범위한 영향을 미칠 수 있음
- **중복된 useEffect 패턴 개선**: 현재 패턴이 명확하고 이해하기 쉬움

### 추후 고려 사항

- React Query 마이그레이션 확대 (별도 작업으로 진행 예정)
- 인라인 스타일 Tailwind CSS 전환 (선택적)

---

**작성일**: 2024년  
**최종 업데이트**: 2026년 1월 2일  
**참고**: useQuery 마이그레이션은 별도 작업으로 진행 예정
