// 최근 검색어 관련 유틸리티
const RECENT_SEARCH_KEY = 'recent_search_keywords_v1';
const DEFAULT_MAX = 10;

// localStorage에서 받은 문자열을 json으로 파싱, 문자열로 반환
// 런타임 에러 방지
function safeParseList(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    return [];
  }
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

// 최근 검색어 로드
export function loadRecentKeywords(): string[] {
  if (!canUseStorage()) return [];
  return safeParseList(window.localStorage.getItem(RECENT_SEARCH_KEY));
}

// 최신 검색어 저장
export function saveRecentKeywords(list: string[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(list));
}

// 최신 검색어에 추가
export function addRecentKeyword(keyword: string, max: number = DEFAULT_MAX) {
  const k = keyword.trim();
  if (!k) return;
  const prev = loadRecentKeywords();
  const next = [k, ...prev.filter((x) => x !== k)].slice(0, max);
  saveRecentKeywords(next);
}

// 최신 검색어에서 keyword 삭제
export function removeRecentKeyword(keyword: string) {
  const k = keyword.trim();
  if (!k) return;
  const next = loadRecentKeywords().filter((x) => x !== k);
  saveRecentKeywords(next);
}

// 최신 검색어에서 모두 제거
export function clearRecentKeywords() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(RECENT_SEARCH_KEY);
}
