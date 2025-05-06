# mjs-front

## Installation
1. 노드 버전 셋업
```bash
nvm use
```
- 커멘드를 실행하면 node 20.17.0으로 셋업됩니다
- 처음 설치 시 뿐만 아니라 작업 전에 항상 수행

2. 패키지 설치
```bash
npm install
```

3. [vscode 셋업](https://yarnpkg.com/getting-started/editor-sdks)
- [ZipFS](https://marketplace.visualstudio.com/items?itemName=arcanis.vscode-zipfs) extension 설치

## Run Dev server
```bash
npm run dev
```

## 깃 전략
### 브랜치 분류
```
main: 운영용
develop: 개발용
feat/{제목}: 기능 개발 브랜치
hotfix/{제목}: 핫픽스 브랜치
```
- `제목`은 케밥케이스 사용

### 커밋 메시지 컨벤션
```
{분류}. {제목}

- {내용1}
- {내용2}
```
- 내용은 필요한 경우에 작성
- `분류`는 아래 [태스크 분류](#태스크-분류) 참고

#### 태스크 분류
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
refactor: 코드 리펙토링
test: 테스트 코드, 리펙토링 테스트 코드 추가
chore: 빌드 업무 수정, 패키지 매니저 수정 등
```
