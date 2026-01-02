import { useEffect, useMemo, useRef, useState } from 'react';
import { getRealTimeSearch } from '../../../api/main/real-time';
import type { TopKeywordsResponse } from '../../../api/main/real-time';
import { Skeleton } from '@/components/atoms/Skeleton';
import { REALTIME_RANK_DEFAULT_LIMIT, REALTIME_RANK_INTERVAL_MS } from '@/constants/common';
import { handleError } from '@/utils/error';

type RankItem = { keyword: string };
type Delta = 'up' | 'down' | 'new' | 'same';

export default function RealtimeRank({
  limit = REALTIME_RANK_DEFAULT_LIMIT,
  intervalMs = REALTIME_RANK_INTERVAL_MS,
}) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [current, setCurrent] = useState<RankItem[]>([]);
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // 이전 순위 보관
  const prevRef = useRef<RankItem[]>([]);

  // 서버 데이터 요청
  const fetchKeywords = async () => {
    try {
      const res: TopKeywordsResponse = await getRealTimeSearch(limit);
      if (!res?.data?.length) {
        setCurrent([]);
        return;
      }
      prevRef.current = current;
      setCurrent(res.data.map((k) => ({ keyword: k })));
      setIsError(false);
    } catch (e) {
      handleError(e, '실시간 검색어를 불러오는 중 오류가 발생했습니다.', { showToast: false });
      setIsError(true);
    } finally {
      setIsLoading(false);
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
    <section className='flex flex-col gap-3' aria-live='polite' aria-label='실시간 검색 순위'>
      <div className='px-3'>
        <h2 className='text-title02 text-mju-primary'>실시간 검색 순위</h2>
      </div>
      <div className='px-6 py-4 flex flex-col gap-2 rounded-xl border-2 border-grey-05'>
        {isError ? (
          <>
            <span className='text-title02 text-mju-primary text-center'>문제가 발생했습니다</span>
            <button
              className='px-3 py-2 self-center text-caption01 cursor-pointer hover:bg-grey-05 rounded-xl transition'
              onClick={fetchKeywords}
            >
              다시 시도하기
            </button>
          </>
        ) : isLoading ? (
          [...Array(10)].map((_, index) => <Skeleton key={index} className='h-8' />)
        ) : (
          current.map((item, idx) => {
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
          })
        )}
        {!isLoading && current.length === 0 && <p>아직 실시간 검색 순위가 없는데요</p>}
      </div>
    </section>
  );
}
