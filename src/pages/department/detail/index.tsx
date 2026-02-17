import { IoIosArrowForward } from 'react-icons/io';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarGrid, { type CalendarEventItem } from '../../../components/organisms/CalendarGrid';
import DepartmentNoticeBoard, {
  type DepartmentNoticeBoardItem,
} from '../../../components/organisms/DepartmentNoticeBoard';
import NavigationUp from '../../../components/molecules/NavigationUp';
import GlobalErrorPage from '../../error';

/**
 * 학과 상세 페이지
 *
 * 특정 학과의 일정과 학생회 공지사항을 표시하는 페이지입니다.
 * 탭을 통해 학과일정과 학생회 공지사항을 전환할 수 있습니다.
 */
export default function DepartmentDetail() {
  const navigate = useNavigate();
  const [isError] = useState(false);
  const [isLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'학과일정' | '학생회 공지사항'>('학과일정');
  const [schedules] = useState<CalendarEventItem[]>([]);
  const [noticeItems] = useState<DepartmentNoticeBoardItem[]>([]);
  const [, setPage] = useState(0);
  const [totalPages] = useState(0);
  const [, setCurrentMonth] = useState(0);
  const [, setCurrentYear] = useState(0);

  const [collegeName] = useState('');
  const [departmentName] = useState('');
  const [departmentImage, setDepartmentImage] = useState<string | null>('');
  const [departmentSlogan] = useState('');
  const [departmentDescription] = useState('');
  const [departmentInstagramUrl] = useState('');
  const [departmentLink] = useState('');

  if (isError) return <GlobalErrorPage />;

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
      <NavigationUp onClick={() => navigate(-1)} />
      {!isLoading && (
        <>
          <div className='flex gap-6'>
            {departmentImage && (
              <img
                src={departmentImage}
                alt='학과이미지'
                className='hidden h-46 w-46 rounded-full object-cover md:block'
                onError={() => setDepartmentImage(null)}
              />
            )}
            <div className='flex flex-1 flex-col gap-6'>
              <div className='flex flex-col gap-2 md:gap-3'>
                <div className='flex flex-row gap-4 md:flex-col md:gap-3'>
                  {departmentImage && (
                    <img
                      src={departmentImage}
                      alt='학과이미지'
                      className='h-24 w-24 rounded-full object-cover md:hidden'
                      onError={() => setDepartmentImage(null)}
                    />
                  )}
                  <div className='flex flex-col gap-2 md:gap-3'>
                    <button className='bg-blue-05 w-fit rounded-sm px-2 py-0.5'>
                      <p className='text-body03 text-blue-20'>{collegeName}</p>
                    </button>
                    <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-6'>
                      <p className='text-heading01'>{departmentName}</p>
                      <p className='text-body01'>{departmentSlogan}</p>
                    </div>
                  </div>
                </div>
                <div className='bg-grey-05 gap-2.5 rounded-xl p-6'>
                  <p className='text-body03 text-grey-40'>{departmentDescription}</p>
                </div>
                <div className='flex flex-col gap-4 md:flex-row md:gap-6'>
                  <a
                    href={departmentInstagramUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='border-grey-05 flex flex-1 cursor-pointer flex-col gap-2 rounded-xl border-2 px-5 py-4'
                  >
                    <div className='flex w-full items-center justify-between'>
                      <p className='text-title02'>인스타그램</p>
                      <IoIosArrowForward className='text-blue-10 text-xl' />
                    </div>
                    <span className='text-caption02 text-grey-40'>@인스타아이디</span>
                  </a>
                  <a
                    href={departmentLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='border-grey-05 flex flex-1 cursor-pointer flex-col gap-2 rounded-xl border-2 px-5 py-4'
                  >
                    <div className='flex w-full items-center justify-between'>
                      <p className='text-title02'>학교 공식 홈페이지</p>
                      <IoIosArrowForward className='text-blue-10 text-xl' />
                    </div>
                    <span className='text-caption02 text-grey-40'>@링크링크</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-6'>
            <div className='border-grey-10 flex border-b-1 px-3'>
              {['학과일정', '학생회 공지사항'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as '학과일정' | '학생회 공지사항')}
                  className={`flex-1 cursor-pointer py-3 text-center font-semibold ${
                    activeTab === tab ? 'text-blue-35 border-blue-35 border-b-2' : 'text-grey-40'
                  }`}
                >
                  <p className='text-title02'>{tab}</p>
                </button>
              ))}
            </div>
            {activeTab === '학과일정' ? (
              <div className='md:p-6'>
                <CalendarGrid
                  events={schedules}
                  onYearChange={setCurrentYear}
                  onMonthChange={setCurrentMonth}
                />
              </div>
            ) : (
              <div className='md:p-3'>
                <DepartmentNoticeBoard
                  items={noticeItems}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
