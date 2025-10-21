import { getAcademicCalendar, type CalendarMonthlyRes } from '@/api/main/calendar';
import Button from '@/components/atoms/Button';
import { Skeleton } from '@/components/atoms/Skeleton';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * 시작일과 종료일을 받아서 "MM.DD" 또는 "MM.DD - MM.DD" 형식으로 반환합니다.
 * @param startDate - 'YYYY-MM-DD'
 * @param endDate - 'YYYY-MM-DD'
 * @returns string - 포맷팅된 날짜 문자열
 */
const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const format = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}.${day}`;
  };

  if (startDate === endDate) {
    return format(start);
  } else {
    return `${format(start)} - ${format(end)}`;
  }
};

/**
 * API 응답의 키와 화면에 표시될 라벨, Tailwind CSS 클래스를 매핑합니다.
 */
const scheduleCategories = {
  all: { label: '전체', className: 'bg-blue-20 text-white' },
  undergrad: { label: '학부', className: 'bg-mju-primary text-white' },
  graduate: { label: '대학원', className: 'bg-grey-40 text-white' },
  holiday: { label: '휴일', className: 'bg-error text-white' },
};

interface AcademicScheduleWidgetProps {
  className?: string;
}

export default function AcademicScheduleWidget({ className }: AcademicScheduleWidgetProps) {
  const [scheduleData, setScheduleData] = useState<CalendarMonthlyRes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const categoryOrder: (keyof typeof scheduleCategories)[] = [
    'all',
    'undergrad',
    'graduate',
    'holiday',
  ];

  useEffect(() => {
    getData();
  }, []);

  /**
   * 캘린더 데이터를 불러옵니다
   */
  async function getData() {
    try {
      setIsLoading(true);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const res = await getAcademicCalendar(currentYear, currentMonth);
      setScheduleData(res);
      setIsError(false);
    } catch (e) {
      console.error('academic-schedule-widget.tsx', e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <div
        className={`
        flex flex-col gap-4 bg-white rounded-xl p-5
        ${className}
        `}
      >
        <div className='flex justify-between items-center'>
          <h3 className='text-title01 text-blue-35'>학사일정</h3>
          <Link to='/academic-calendar' className='text-caption01 text-grey-20'>
            더보기
          </Link>
        </div>
        {isError ? (
          <div className='p-4 flex flex-col items-center gap-4'>
            <h3 className='text-title01'>문제가 발생했습니다</h3>
            <Button onClick={getData}>다시 시도하기</Button>
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            {isLoading && (
              <>
                <Skeleton className='h-8' />
                <Skeleton className='h-12' />
                <Skeleton className='h-8' />
                <Skeleton className='h-4' />
              </>
            )}
            {!isLoading &&
              scheduleData &&
              categoryOrder.map((key, index) => {
                const category = scheduleCategories[key];
                const events = scheduleData[key];

                /**
                 * 해당 카테고리에 일정이 없으면 렌더링하지 않습니다.
                 */
                if (!events || events.length === 0) {
                  return null;
                }

                return (
                  <div key={key}>
                    <div className='flex gap-2'>
                      <div
                        className={`w-12 flex items-center justify-center ${category.className}`}
                      >
                        <span className='text-[12px] text-white'>{category.label}</span>
                      </div>
                      <div className='flex flex-col gap-0.5'>
                        <ul>
                          {events.map((event) => (
                            <li key={event.id} className='flex items-center'>
                              <span className='inline-block w-20 text-[12px] text-grey-40'>
                                {formatDateRange(event.startDate, event.endDate)}
                              </span>
                              <span className='text-[14px] text-black line-clamp-1'>
                                {removeBracketedContent(event.description)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {index < categoryOrder.length - 1 && (
                      <div className='h-[1px] mt-3 bg-grey-10' />
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Removes all content, including the square brackets, that is enclosed
 * within [ and ] from a given string.
 *
 * @param inputString The string to process.
 * @returns The processed string with bracketed content removed.
 */
function removeBracketedContent(inputString: string): string {
  // Regular expression to match any character(s) (non-greedy, represented by '.*?' or '[^\]]*')
  // enclosed between a literal '[' and a literal ']'. The 'g' flag ensures
  // all occurrences are replaced.
  const regex = /\[.*?\]/g;

  // Replace all matches of the regex with an empty string.
  return inputString.replace(regex, '');
}
