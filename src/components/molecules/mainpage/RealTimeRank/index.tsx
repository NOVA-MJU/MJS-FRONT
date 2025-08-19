import { useEffect, useMemo, useRef, useState } from 'react';

type RankItem = { keyword: string };
type Delta = 'up' | 'down' | 'new' | 'same';

type RealtimeSearchProps = {
  items?: RankItem[]; // 외부 데이터 주입 시 사용
  limit?: number; // 표시할 개수
  intervalMs?: number; // 갱신 주기 (ms)
  title?: string; // 상단 타이틀
};

const DUMMY: RankItem[] = [
  { keyword: '장학금 신청' },
  { keyword: '수강신청 오류' },
  { keyword: '기숙사 추가모집' },
  { keyword: '졸업요건' },
  { keyword: '중고 아이패드' },
  { keyword: '명대신문' },
  { keyword: '방송국 리포터' },
  { keyword: '근로장학생' },
  { keyword: '시험 기출' },
  { keyword: '채용 설명회' },
];

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RealtimeRank({
  items,
  limit = 10,
  intervalMs = 10000,
  title = '실시간 검색 순위',
}: RealtimeSearchProps) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const base = useMemo(() => (items?.length ? items : DUMMY).slice(0, limit), [items, limit]);

  // 현재/이전 순위 보관
  const [current, setCurrent] = useState<RankItem[]>(base);
  const prevRef = useRef<RankItem[]>(base);

  // 10초마다 더미 갱신
  useEffect(() => {
    if (prefersReduced) return;
    const t = setInterval(() => {
      const next = shuffle(base).slice(0, limit);
      prevRef.current = current;
      setCurrent(next);
    }, intervalMs);
    return () => clearInterval(t);
  }, [base, limit, intervalMs, prefersReduced, current]);

  // 키워드 → 인덱스 매핑으로 delta 계산
  const deltas: Record<string, Delta> = useMemo(() => {
    const prevIndex = new Map(prevRef.current.map((it, i) => [it.keyword, i]));
    const map: Record<string, Delta> = {};
    current.forEach((it, i) => {
      if (!prevIndex.has(it.keyword)) map[it.keyword] = 'new';
      else {
        const pi = prevIndex.get(it.keyword)!;
        if (pi > i) map[it.keyword] = 'up';
        else if (pi < i) map[it.keyword] = 'down';
        else map[it.keyword] = 'same';
      }
    });
    return map;
  }, [current]);

  return (
    <section
      className='rounded-lg border-grey-40 mt-2 bg-white shadow-md px-4 py-4'
      aria-live='polite'
      aria-label='실시간 검색 순위'
    >
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='text-base font-semibold text-gray-800'>{title}</h3>
        <span className='text-xs text-gray-400'>데이터</span>
      </div>

      <ol className='divide-y text-sm '>
        {current.map((item, idx) => {
          const delta = deltas[item.keyword] || 'same';
          return (
            <li key={item.keyword} className='flex items-center gap-3 py-2'>
              <span
                className={`w-6 h-6 shrink-0 grid place-items-center rounded-lg text-xs font-bold ${
                  idx < 3 ? 'bg-mju-primary text-white' : 'bg-gray-100 text-grey-20'
                }`}
              >
                {idx + 1}
              </span>

              <span className='flex-1 truncate' title={item.keyword}>
                {item.keyword}
              </span>

              <span
                className={`text-xs tabular-nums ${
                  delta === 'up'
                    ? 'text-green-600'
                    : delta === 'down'
                      ? 'text-red-600'
                      : delta === 'new'
                        ? 'text-blue-600'
                        : 'text-gray-400'
                }`}
                aria-label={
                  delta === 'up'
                    ? '상승'
                    : delta === 'down'
                      ? '하락'
                      : delta === 'new'
                        ? '새 항목'
                        : '변동 없음'
                }
              >
                {delta === 'up' && '▲'}
                {delta === 'down' && '▼'}
                {delta === 'new' && 'NEW'}
                {delta === 'same' && '—'}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
