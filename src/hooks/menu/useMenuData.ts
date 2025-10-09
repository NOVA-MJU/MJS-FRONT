//Daily는 ‘하루 3끼 + 스와이프’, Weekly는 ‘한 주 테이블’—요구사항과 레이아웃이 완전히 달라요. 한 컴포넌트에 섞으면 if 블록이 폭증하고 유지가 어려워집니다.
//단일 책임을 위해서 커스텀 훅으로 분리합니다.
//상태, 파생데이터, 핸들러 함수 및 유틸함수들을 분리해놓겠습니다.
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMenus } from '@/api/menu';
import type { MenuItem } from '@/api/menu';

export function useMenuData() {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery<MenuItem[]>({
    queryKey: ['menus'],
    queryFn: getMenus,
    staleTime: 5 * 60 * 1000,
  });

  const groupedByDate = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const m of data) {
      if (!map.has(m.date)) map.set(m.date, []);
      map.get(m.date)!.push(m);
    }
    for (const [, arr] of map) {
      arr.sort(
        (a, b) =>
          ['BREAKFAST', 'LUNCH', 'DINNER'].indexOf(a.menuCategory) -
          ['BREAKFAST', 'LUNCH', 'DINNER'].indexOf(b.menuCategory),
      );
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [data]);

  const todayKey = (() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dow = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
    return `${mm}.${dd} (${dow})`;
  })();
  const getByDate = (key: string) => groupedByDate.find(([d]) => d === key)?.[1] ?? [];
  const keys = groupedByDate.map(([k]) => k);

  return { isLoading, error, groupedByDate, keys, todayKey, getByDate };
}
