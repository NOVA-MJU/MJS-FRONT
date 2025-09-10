import { useEffect, useMemo, useRef, useState } from 'react';
import { getRealTimeSearch } from '../../../../api/main/real-time';
import type { TopKeywordsResponse } from '../../../../api/main/real-time';

type RankItem = { keyword: string };
type Delta = 'up' | 'down' | 'new' | 'same';

type RealtimeSearchProps = {
  limit?: number; // 표시할 개수
  intervalMs?: number; // 갱신 주기 (ms)
  title?: string; // 상단 타이틀
};

export default function RealtimeRank({
  limit = 10,
  intervalMs = 10000,
  title = '실시간 검색 순위',
}: RealtimeSearchProps) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const [current, setCurrent] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 이전 순위 보관
  const prevRef = useRef<RankItem[]>([]);

  // 서버 데이터 요청
  const fetchKeywords = async () => {
    try {
      setLoading(true);
      setError(null);
      const res: TopKeywordsResponse = await getRealTimeSearch(limit);
      if (!res?.data?.length) {
        setCurrent([]);
        setError('검색량이 부족합니다.');
        return;
      }
      prevRef.current = current;
      setCurrent(res.data.map((k) => ({ keyword: k })));
    } catch (e) {
      console.log('실시간 데이터 불러오기 오류', e);
      setError('실시간 검색어 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  // 첫 로딩 + interval 주기적 갱신
  useEffect(() => {
    if (prefersReduced) return;
    fetchKeywords();
    const t = setInterval(fetchKeywords, intervalMs);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, intervalMs, prefersReduced]);

  // delta 계산
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
      className='rounded-lg  border-grey-40 mt-2 bg-white shadow-md px-4 py-4'
      aria-live='polite'
      aria-label='실시간 검색 순위'
    >
      <div className='mb-4 flex items-center justify-between'>
        <h3 className=' font-bold text-mju-primary text-2xl'>{title}</h3>
        <span className='text-xs text-grey-40'>데이터</span>
      </div>

      {loading && <p className='text-sm text-gray-40'>불러오는 중...</p>}
      {!loading && error && <p className='text-sm text-grey-40'>{error}</p>}

      {!loading && !error && (
        <ol className='divide-y text-sm'>
          {current.map((item, idx) => {
            const delta = deltas[item.keyword] || 'same';
            return (
              <li key={item.keyword} className='flex items-center gap-3 py-2'>
                <span
                  className={`w-6 h-6 shrink-0 grid place-items-center rounded-lg text-xs font-bold ${
                    idx < 3 ? 'bg-mju-primary text-white' : 'bg-grey-40 text-grey-20'
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
      )}
    </section>
  );
}
