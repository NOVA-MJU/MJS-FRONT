import type { CalendarMonthlyRes, CalendarScheduleItem } from '@/api/main/calendar';
import { useMemo } from 'react';
import clsx from 'clsx';

type ScheduleCategoryKey = 'all' | 'undergrad' | 'graduate' | 'holiday';

const scheduleCategories: Record<ScheduleCategoryKey, { label: string; className: string }> = {
  all: { label: '전체', className: 'bg-blue-20' },
  undergrad: { label: '학부', className: 'bg-mju-primary' },
  graduate: { label: '대학원', className: 'bg-grey-40' },
  holiday: { label: '휴일', className: 'bg-error' },
};

interface DailyAcademicScheduleWidgetProps {
  date: Date;
  events: CalendarMonthlyRes | null;
}

function DailyAcademicScheduleWidget({ date, events }: DailyAcademicScheduleWidgetProps) {
  /**
   * 오늘 날짜 표시
   */
  function formatDateWithDay() {
    const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayOfWeek = dayMap[date.getDay()];
    return `${month}.${day} (${dayOfWeek})`;
  }

  /**
   * 이벤트 날짜별 필터링
   */
  const filteredEvents = useMemo(() => {
    if (!events) {
      return [];
    }
    const selectedDateStr = getISODateString(date);
    const allEvents: (CalendarScheduleItem & { category: ScheduleCategoryKey })[] = [
      ...events.all.map((e) => ({ ...e, category: 'all' as const })),
      ...events.undergrad.map((e) => ({ ...e, category: 'undergrad' as const })),
      ...events.graduate.map((e) => ({ ...e, category: 'graduate' as const })),
      ...events.holiday.map((e) => ({ ...e, category: 'holiday' as const })),
    ];
    return allEvents.filter((event) => {
      return selectedDateStr >= event.startDate && selectedDateStr <= event.endDate;
    });
  }, [date, events]);

  return (
    <section>
      <div className='min-h-16 flex gap-4'>
        <span className='text-body03 text-mju-primary'>{formatDateWithDay()}</span>
        <div className='flex-1 flex flex-col gap-1'>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const categoryInfo = scheduleCategories[event.category];
              return (
                <div key={event.id} className='flex gap-2 items-center'>
                  <div className={clsx('w-2.5 h-2.5', categoryInfo.className)} />
                  <div className='flex-1'>
                    <span key={event.id} className='text-caption02 line-clamp-1'>
                      {removeBracketedContent(event.description)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <span className='text-caption02 text-grey-20'>일정이 없습니다</span>
          )}
        </div>
      </div>
    </section>
  );
}

export { DailyAcademicScheduleWidget };

/**
 * Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환
 */
function getISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 이벤트 제목에서 대괄호 제거
 */
function removeBracketedContent(inputString: string): string {
  const regex = /\[.*?\]/g;
  return inputString.replace(regex, '');
}
