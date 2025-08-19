'use client';

import { useEffect, useMemo, useState } from 'react';
import { getAcademicEvents } from '../../../../api/calendar';

type CalendarEventItem = {
  year: number;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  description: string;
};

/** ──────────────── 안전한 타입 가드 & 파서 ──────────────── */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
function isCalItemArray(v: unknown): v is CalendarEventItem[] {
  return Array.isArray(v) && v.every(isCalendarEventItemShallow);
}
function isCalendarEventItemShallow(v: unknown): v is CalendarEventItem {
  if (!isRecord(v)) return false;
  return (
    typeof v.year === 'number' &&
    typeof v.startDate === 'string' &&
    typeof v.endDate === 'string' &&
    typeof v.description === 'string'
  );
}
function extractContent(payload: unknown): CalendarEventItem[] {
  // 1) 배열로 바로 오는 경우
  if (isCalItemArray(payload)) return payload;

  if (isRecord(payload)) {
    // 2) { content: [...] }
    const content = payload['content'];
    if (isCalItemArray(content)) return content;

    // 3) { data: { content: [...] } }
    const data = payload['data'];
    if (isRecord(data)) {
      const inner = data['content'];
      if (isCalItemArray(inner)) return inner;
    }
  }
  return [];
}
function getErrorMessage(e: unknown): string {
  return e instanceof Error ? e.message : '학사일정을 불러오지 못했습니다.';
}

function toDate(d: string) {
  const [y, m, dd] = d.split('-').map(Number);
  return new Date(y, m - 1, dd);
}
function fmtMMDD(dt: Date) {
  return `${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`;
}
function fmtRange(a: Date, b: Date) {
  return `${fmtMMDD(a)} ~ ${fmtMMDD(b)}`;
}
function overlapsMonth(ev: CalendarEventItem, y: number, m0to11: number) {
  const s = toDate(ev.startDate);
  const e = toDate(ev.endDate);
  const sk = s.getFullYear() * 12 + s.getMonth();
  const ek = e.getFullYear() * 12 + e.getMonth();
  const tk = y * 12 + m0to11;
  return sk <= tk && tk <= ek;
}
function isOngoing(ev: CalendarEventItem, today = new Date()) {
  const s = toDate(ev.startDate);
  const e = toDate(ev.endDate);
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return s <= t && t <= e;
}

type Props = {
  initialYear?: number;
  initialMonth?: number; // 0~11
  maxItems?: number; // 기본 6
  className?: string;
};

export default function AcademicSchedulePanel({
  initialYear,
  initialMonth,
  maxItems = 6,
  className = '',
}: Props) {
  const now = new Date();
  const [year, setYear] = useState(initialYear ?? now.getFullYear());
  const [month, setMonth] = useState(initialMonth ?? now.getMonth());
  const [rows, setRows] = useState<CalendarEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const resp = await getAcademicEvents({
          year,
          page: 0,
          size: 1000,
          sortBy: 'startDate',
          sortDir: 'asc',
        } as unknown); // 호출부는 외부 라이브러리 시그니처에 맞춤

        const content = extractContent(resp);
        const onlyYear = content.filter(
          (it) =>
            toDate(it.startDate).getFullYear() === year ||
            toDate(it.endDate).getFullYear() === year,
        );

        onlyYear.sort((a, b) => {
          const as = toDate(a.startDate).getTime();
          const bs = toDate(b.startDate).getTime();
          if (as !== bs) return as - bs;
          const ae = toDate(a.endDate).getTime();
          const be = toDate(b.endDate).getTime();
          if (ae !== be) return ae - be;
          return (a.description || '').localeCompare(b.description || '');
        });

        if (!alive) return;
        setRows(onlyYear);
      } catch (e: unknown) {
        if (!alive) return;
        setErr(getErrorMessage(e));
        setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [year]);

  const monthItems = useMemo(() => {
    const list = rows.filter((ev) => overlapsMonth(ev, year, month));
    return list.slice(0, maxItems);
  }, [rows, year, month, maxItems]);

  const title = `${year}년 ${month + 1}월`;

  const prevMonth = () => {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };
  const nextMonth = () => {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  return (
    <section
      className={`w-full rounded-2xl border border-grey-40 bg-white shadow-sm px-4 py-5 md:px-6 md:py-6 ${className}`}
      aria-label='학사일정'
    >
      <h3 className='text-2xl font-bold text-mju-primary mb-4'>학사일정</h3>

      {/* 상단 월 선택 바 */}
      <div className='px-3 py-2 md:px-4 md:py-3 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <button
            onClick={prevMonth}
            className='inline-flex h-9 w-9 items-center justify-center rounded-full text-mju-primary hover:bg-mju-primary/10 hover:text-mju-primary focus:outline-none focus:ring-2 focus:ring-mju-primary/30'
            aria-label='이전 달'
            type='button'
          >
            <span className='text-2xl leading-none'>‹</span>
          </button>

          <h2 className='text-xl md:text-2xl font-extrabold tracking-tight text-gray-900'>
            {title}
          </h2>

          <button
            onClick={nextMonth}
            className='inline-flex h-9 w-9 items-center justify-center rounded-full text-mju-primary hover:bg-mju-primary/10 hover:text-mju-primary focus:outline-none focus:ring-2 focus:ring-mju-primary/30'
            aria-label='다음 달'
            type='button'
          >
            <span className='text-2xl leading-none'>›</span>
          </button>
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className='mt-4'>
        {loading && (
          <ul className='space-y-3'>
            {Array.from({ length: maxItems }).map((_, i) => (
              <li key={i} className='h-4 rounded bg-gray-100 animate-pulse' />
            ))}
          </ul>
        )}

        {!loading && err && <p className='text-sm text-red-600'>{err}</p>}

        {!loading && !err && monthItems.length === 0 && (
          <div className='text-sm text-gray-500'>해당 월의 일정이 없습니다.</div>
        )}

        {!loading && !err && monthItems.length > 0 && (
          <ol className='divide-y divide-gray-100'>
            {monthItems.map((ev, idx) => {
              const s = toDate(ev.startDate);
              const e = toDate(ev.endDate);
              const ongoing = isOngoing(ev);
              const isHoliday = /휴일|공휴일|휴무|방학/i.test(ev.description ?? '');

              const titleClass =
                (ongoing ? 'text-mju-primary ' : 'text-gray-900 ') +
                'text-[15px] md:text-base font-semibold';
              const dateClass =
                'mt-1 text-sm ' + (isHoliday ? 'text-error font-medium' : 'text-gray-500');

              return (
                <li key={`${ev.startDate}-${ev.endDate}-${idx}`} className='py-4'>
                  <div className={titleClass}>{ev.description}</div>
                  <div className={dateClass}>{fmtRange(s, e)}</div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
