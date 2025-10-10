import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMenus, type MenuItem } from '@/api/menu';

const ORDER: Array<MenuItem['menuCategory']> = ['BREAKFAST', 'LUNCH', 'DINNER'];

export function useMenuData() {
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery<MenuItem[]>({
    queryKey: ['menus'],
    queryFn: getMenus,
    staleTime: 5 * 60 * 1000,
  });

  const stripDow = (s: string) => s.replace(/\s*\([^)]*\)\s*/g, '').trim(); // '(월)' 같은 요일 제거

  // 날짜별 그룹 + 끼니 순 정렬 + 날짜 정렬
  const groupedByDate = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const m of data) {
      if (!map.has(m.date)) map.set(m.date, []);
      map.get(m.date)!.push(m);
    }
    for (const [, arr] of map) {
      arr.sort((a, b) => ORDER.indexOf(a.menuCategory) - ORDER.indexOf(b.menuCategory));
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [data]);

  // 키 모음 / 오늘 키 / 헬퍼
  const keys = groupedByDate.map(([k]) => k);
  const todayKey = useMemo(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const canonical = `${mm}.${dd}`; // 요일 없는 '정규 키'

    // 실제 keys 배열에서 요일 유무와 무관하게 매칭되는 '실제 키'를 찾음
    const found = keys.find((k) => stripDow(k) === canonical);
    // 찾으면 그걸 todayKey로, 없으면 첫 번째 키
    return found ?? keys[0] ?? '';
  }, [keys]);

  const getByDate = (key: string) => groupedByDate.find(([d]) => d === key)?.[1] ?? [];

  return { isLoading, error, refetch, groupedByDate, keys, todayKey, getByDate };
}
