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
    const dow = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
    return `${mm}.${dd} (${dow})`;
  }, []);

  const getByDate = (key: string) => groupedByDate.find(([d]) => d === key)?.[1] ?? [];

  return { isLoading, error, refetch, groupedByDate, keys, todayKey, getByDate };
}
