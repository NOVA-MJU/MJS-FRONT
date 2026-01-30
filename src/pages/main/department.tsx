import { useState } from 'react';
import { MdOutlineContentCopy } from 'react-icons/md';
import { FiHome } from 'react-icons/fi';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { Tabs } from '@/components/atoms/Tabs';
import Calendar from '@/components/molecules/Calendar';
import type { CalendarMonthlyRes } from '@/api/main/calendar';
import clsx from 'clsx';
import { IoIosArrowDown } from 'react-icons/io';
import { InstagramIcon } from '@/components/atoms/Icon';
import { Link } from 'react-router-dom';

const TABS = {
  schedule: '소속 일정',
  'department-notice': '소속 공지사항',
  'student-council-notice': '학생회 공지사항',
};

export default function DepartmentMainPage() {
  // 단과대 필터
  const [selectedCollege] = useState('인공지능 소프트웨어융합대학');

  function handleCollegeFilter() {}

  function handleDepartmentFilter() {}

  // 탭 선택
  const [currentTab, setCurrentTab] = useState(Object.keys(TABS)[0]);

  // 소속 일정
  const [, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [monthEvents] = useState<CalendarMonthlyRes | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dayEvents] = useState(CALENDAR_DATA);

  // 소속 공지사항
  const [noticeData] = useState(NOTICE_DATA);

  // 학생회 공지사항
  const [feeds] = useState(FEED_DATA);

  return (
    <section>
      {/* 단과대 필터 */}
      <div className='flex gap-2 px-5 py-4'>
        <button
          className={clsx(
            'flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5',
            'text-body06 text-mju-primary',
            'border-mju-primary border-1',
          )}
          onClick={handleCollegeFilter}
        >
          {selectedCollege}
          <IoIosArrowDown className='text-grey-40' />
        </button>
        <button
          className={clsx(
            'flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5',
            'text-body06 text-grey-60',
            'border-grey-10 border-1',
          )}
          onClick={handleDepartmentFilter}
        >
          학과 필터
          <IoIosArrowDown className='text-grey-40' />
        </button>
      </div>

      <div className='bg-grey-02 h-2' />

      <div className='flex flex-1 flex-col'>
        <div className='flex flex-col gap-3.5 pt-5 pb-6.5'>
          {/* 학과 정보 카드 */}
          <div className='flex flex-col gap-2 px-5'>
            <span className='text-title03 text-black'>인공지능 소프트웨어융합대학</span>
            <div className='flex items-center gap-1'>
              <span className='text-body05 text-grey-80'>교학팀</span>
              <span className='text-body05 text-grey-30'>02-300-0733</span>
              <span className='text-blue-15 cursor-pointer p-0.75'>
                <MdOutlineContentCopy />
              </span>
            </div>
          </div>

          {/* 바로가기 버튼 */}
          <div className='flex gap-3 px-5'>
            <a className='text-grey-80 text-caption02 border-grey-10 flex cursor-pointer items-center gap-2 rounded-sm border-1 px-2 py-1'>
              <FiHome className='text-blue-10' />
              경영대학
            </a>
            <a className='text-grey-80 text-caption02 border-grey-10 flex cursor-pointer items-center gap-2 rounded-sm border-1 px-2 py-1'>
              <InstagramIcon />
              단과대
            </a>
          </div>
        </div>

        {/* 탭 선택 */}
        <div className='border-grey-10 border-b-1 px-5'>
          <Tabs
            tabs={TABS}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            className='text-body04 border-b-0'
          />
        </div>

        {/* 소속 일정 탭 */}
        {currentTab === 'schedule' && (
          <section>
            <div className='flex flex-col'>
              <Calendar
                className='m-5'
                events={monthEvents}
                onYearChange={setCurrentYear}
                onMonthChange={setCurrentMonth}
                onDateSelect={setSelectedDate}
              />
              {/* 선택한 날짜 이벤트 목록 */}
              <div className='border-grey-02 mb-2 border-b-1 px-5 py-1'>
                <span className='text-body02 text-mju-primary'>
                  {format(selectedDate, 'MM.dd (EEE)', { locale: ko })}
                </span>
              </div>
              <div>
                {dayEvents.map((event) => (
                  <div key={event.id} className='flex items-start gap-2 px-5 py-2'>
                    <span className='text-caption02 text-grey-40 min-w-19'>
                      {format(new Date(event.startDate), 'MM.dd', { locale: ko })}
                      {event.endDate &&
                        ` - ${format(new Date(event.endDate), 'MM.dd', { locale: ko })}`}
                    </span>
                    <span className='text-caption02 flex-1 text-black'>{event.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 소속 공지사항 탭 */}
        {currentTab === 'department-notice' && (
          <section>
            <div className='flex flex-col py-5'>
              {noticeData.map((notice) => (
                <div
                  key={notice.id}
                  className={clsx(
                    'cursor-pointer px-5 py-2.5',
                    'hover:bg-blue-05 transition duration-50 hover:transition-none',
                  )}
                >
                  <p className='text-caption04 text-grey-30'>
                    {format(new Date(notice.createdAt), 'yyyy.MM.dd', { locale: ko })}
                  </p>
                  <p className='text-body05 mt-0.5 line-clamp-2 min-h-[3em] text-black'>
                    {notice.title}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 학생회 공지사항 탭 */}
        {currentTab === 'student-council-notice' && (
          <section>
            <div className='grid grid-cols-3 gap-1 py-5'>
              {feeds.map((instagram) => (
                <Link
                  key={instagram.id}
                  to={`${instagram.id}`}
                  className='bg-grey-02 aspect-[4/5] cursor-pointer'
                >
                  <img
                    src={instagram.imageUrl}
                    alt='instagram'
                    className='h-full w-full object-cover'
                  />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

// 더미 데이터
const CALENDAR_DATA = [
  {
    id: 1,
    startDate: '2025-01-05T00:00:00.000Z',
    endDate: null,
    title: '학기 개시일, 2학기 개강 학기 개시일, 2학기 개강',
  },
  {
    id: 2,
    startDate: '2025-01-05T00:00:00.000Z',
    endDate: null,
    title: '학기 개시일, 2학기 개강 학기 개시일',
  },
  {
    id: 3,
    startDate: '2025-01-05T09:00:00.000Z',
    endDate: '2025-01-09T18:00:00.000Z',
    title: '수강신청 변경 기간 수강신청 변경 기간수강신청 변경 기간 수강신청 변경 기간',
  },
];

const NOTICE_DATA = [
  {
    id: 1,
    createdAt: '2025-12-09T09:00:00.000Z',
    title: '[채용공고] Manyfast Tech-Lead 채용 및 사업설명회',
  },
  {
    id: 2,
    createdAt: '2025-04-24T10:30:00.000Z',
    title: '[특강] 융합소프트웨어학부 취업 특강 안내 (메가스터디)',
  },
  {
    id: 3,
    createdAt: '2025-02-21T14:00:00.000Z',
    title: '2025학년도 1학기 융합소프트웨어학부 수강신청(증원) 관련 안내 (추가)',
  },
  {
    id: 4,
    createdAt: '2025-02-06T11:00:00.000Z',
    title: '2025학년도 인공지능·소프트웨어융합대학 교과과정 개편 안내',
  },
  {
    id: 5,
    createdAt: '2025-02-05T16:45:00.000Z',
    title: '2025학년도 1학기 수강신청(데이터베이스 교과목) 관련 안내',
  },
];

const FEED_DATA = [
  {
    id: 1,
    imageUrl:
      'https://www.visitdubai.com/-/media/images/leisure/campaigns/delicious-dubai-nordics/nordics-campaign-arabic-food-dubai-header-2.jpg?&cw=256&ch=256',
  },
  {
    id: 2,
    imageUrl: 'https://cookingqueens.nl/wp-content/uploads/2020/05/Arabische-platter.jpg',
  },
  {
    id: 3,
    imageUrl: 'https://arabiacatering.nl/wp-content/uploads/2020/03/pita-4576076_640.jpg',
  },
  {
    id: 4,
    imageUrl:
      'https://media.triple.guide/triple-cms/c_fill,f_auto,h_256,w_256/ca370307-375e-47ec-a6d6-5d286eb849c2.jpeg',
  },
  {
    id: 5,
    imageUrl:
      'https://media.triple.guide/triple-cms/c_fill,f_auto,h_256,w_256/3334d4c1-1eb3-457c-ad92-76c916b0e838.jpeg',
  },
  {
    id: 6,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmBltPcpSOX4-iGK6CkoVvyrhD-BlnhOCY6w&s',
  },
  {
    id: 7,
    imageUrl:
      'https://djf7qc4xvps5h.cloudfront.net/user/collection/cover/resize/LTYxNjkzMjE1MWdvb2QzMDEwMTYxNzE1NDUxMTMyNA.jpg',
  },
  {
    id: 8,
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyuziTBSJr8l1ZB1FlEvaA3p7oBfpljIKhzQ&s',
  },
  {
    id: 9,
    imageUrl:
      'https://triple.guide/api/images/cast?url=http%3A%2F%2Fblogthumb.pstatic.net%2FMjAyMDAzMThfMTA0%2FMDAxNTg0NTQxMjExMTc3.WCGQtKYZLSREgcDuCl2vUI0A5lme-bWeaM1_LKKw-Ksg.g6-20Y1tiHhMWYOQDIzm2bZX391d9y_8yo4ZYjWXx1og.JPEG.redhollyhock%2F1584541210508.jpg%3Ftype%3Dw2&transformation=c_fill%2Cf_auto%2Cq_auto%2Ch_256%2Cw_256&placeholder=%2Fcontent%2Fstatic%2Fimages%2Fexternal-link-img-blank-photo.svg',
  },
  {
    id: 10,
    imageUrl: 'https://dimg.donga.com/ugc/CDB/WEEKLY/Article/62/21/5a/b7/62215ab70a79d2738276.jpg',
  },
];
