# MJS-FRONT

## Installation

1. 패키지 설치

```bash
npm install
```

2. TypeScript 버전 설정

```
추가 예정 입니다
```

3. Run Dev server

```bash
npm run dev
```

## 깃 전략

### 폴더 구조

```
추가 예정 입니다
.
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public
│   └── vite.svg
├── README.md
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### 브랜치 분류

```
main: 운영용
develop: 개발용
feat/{제목}: 기능 추가
fix/{제목}: 버그 수정
refactor/{제목}: 리팩토링
docs/{제목}: 문서 수정
```

- 제목은 케밥케이스 사용

### 커밋 메시지 컨벤션

```
<{분류}> {제목}

- {내용1}
- {내용2}
```

- 내용은 필요한 경우에 작성
- `분류`는 아래 [태스크 분류](#태스크-분류) 참고

#### 태스크 분류

```
Feat: 새로운 기능 추가
Fix: 버그 수정
Docs: 문서 수정
Style: 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
Refactor: 코드 리펙토링
Test: 테스트 코드, 리펙토링 테스트 코드 추가
Chore: 빌드 업무 수정, 패키지 매니저 수정 등
```
