import { IoIosArrowForward } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from '../../../components/atoms/Typography';
import CalendarGrid, { type CalendarEventItem } from '../../../components/organisms/CalendarGrid';
import {
  getDepartmentDetail,
  getDepartmentSchedules,
  getDepartmentNotices,
} from '../../../api/departments';
import DepartmentNoticeBoard, {
  type DepartmentNoticeBoardItem,
} from '../../../components/organisms/DepartmentNoticeBoard';
import NavigationUp from '../../../components/molecules/NavigationUp';
import { departmentMap } from '../../../constants/departments';
import GlobalErrorPage from '../../error';
import { collegeMap } from '../../../constants/colleges';

/**
 * 학과 상세 페이지
 *
 * 특정 학과의 일정과 학생회 공지사항을 표시하는 페이지입니다.
 * 탭을 통해 학과일정과 학생회 공지사항을 전환할 수 있습니다.
 */
export default function DepartmentDetail() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'학과일정' | '학생회 공지사항'>('학과일정');
  const [schedules, setSchedules] = useState<CalendarEventItem[]>([]);
  const [noticeItems, setNoticeItems] = useState<DepartmentNoticeBoardItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [, setCurrentMonth] = useState(0);
  const [, setCurrentYear] = useState(0);

  const [collegeName, setCollegeName] = useState('');
  const [departmentName, setDepartmentNamne] = useState('');
  const [departmentImage, setDepartmentImage] = useState<string | null>('');
  const [departmentSlogan, setDepartmentSlogan] = useState('');
  const [departmentDescription, setDepartmentDescription] = useState('');
  const [departmentInstagramUrl, setDepartmentInstagramUrl] = useState('');
  const [departmentLink, setDepartmentLink] = useState('');

  useEffect(() => {
    const getData = async () => {
      if (!uuid) return;
      setIsLoading(true);

      try {
        /**
         * 학과 정보를 불러옵니다
         */
        const departmentRes = await getDepartmentDetail(uuid);
        setCollegeName(collegeMap.get(departmentRes.college) ?? departmentRes.college);
        setDepartmentNamne(
          departmentMap.get(departmentRes.departmentName) ?? departmentRes.departmentName,
        );
        setDepartmentImage(departmentRes.studentCouncilLogo);
        setDepartmentSlogan(departmentRes.slogan);
        setDepartmentDescription(departmentRes.description);
        setDepartmentInstagramUrl(departmentRes.instagramUrl);
        setDepartmentLink(departmentRes.homepageUrl);

        /**
         * 학과 캘린더 정보를 불러옵니다
         */
        setSchedules(
          (await getDepartmentSchedules(uuid)).schedules.map(
            ({ title, startDateTime, endDateTime }) => ({
              year: new Date(startDateTime).getFullYear(),
              startDate: startDateTime.slice(0, 10),
              endDate: endDateTime.slice(0, 10),
              description: title,
            }),
          ),
        );

        /**
         * 학과 공지사항 정보를 불러옵니다
         */
        const res = await getDepartmentNotices(uuid, 0, 10);
        setNoticeItems(
          res.content.map((item) => ({
            uuid: item.noticeUuid,
            imageUrl: item.thumbnailUrl,
            title: item.title,
            content: item.previewContent,
            date: item.createdAt,
          })),
        );
        setPage(0);
        setTotalPages(res.totalPages);
      } catch (e) {
        console.error(e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [uuid]);

  useEffect(() => {
    const getData = async () => {
      if (!uuid) return;
      setIsLoading(true);

      try {
        setNoticeItems(
          (await getDepartmentNotices(uuid, page, 10)).content.map((item) => ({
            uuid: item.noticeUuid,
            imageUrl: item.thumbnailUrl,
            title: item.title,
            content: item.previewContent,
            date: item.createdAt,
          })),
        );
      } catch (e) {
        setIsError(true);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
    /**
     * page 값 변화만 감지합니다
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (isError) return <GlobalErrorPage />;

  return (
    <div className='flex-1 p-4 md:p-8 flex flex-col gap-4 md:gap-8'>
      <NavigationUp onClick={() => navigate(-1)} />
      {!isLoading && (
        <>
          <div className='flex gap-6'>
            {departmentImage && (
              <img
                src={departmentImage}
                alt='학과이미지'
                className='hidden md:block w-46 h-46 rounded-full object-cover'
                onError={() => setDepartmentImage(null)}
              />
            )}
            <div className='flex-1 flex flex-col gap-6'>
              <div className='flex flex-col gap-2 md:gap-3'>
                <div className='flex flex-row md:flex-col gap-4 md:gap-3'>
                  {departmentImage && (
                    <img
                      src={departmentImage}
                      alt='학과이미지'
                      className='md:hidden w-24 h-24 rounded-full object-cover'
                      onError={() => setDepartmentImage(null)}
                    />
                  )}
                  <div className='flex flex-col gap-2 md:gap-3'>
                    <button className='w-fit px-2 py-0.5 rounded-sm bg-blue-05'>
                      <Typography variant='body03' className='text-blue-20'>
                        {collegeName}
                      </Typography>
                    </button>
                    <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-6'>
                      <Typography variant='heading01'>{departmentName}</Typography>
                      <Typography variant='body01'>{departmentSlogan}</Typography>
                    </div>
                  </div>
                </div>
                <div className='p-6 gap-2.5 bg-grey-05 rounded-xl'>
                  <Typography variant='body03' className='text-grey-40'>
                    {departmentDescription}
                  </Typography>
                </div>
                <div className='flex flex-col md:flex-row gap-4 md:gap-6'>
                  <a
                    href={departmentInstagramUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex-1 px-5 py-4 gap-2 flex flex-col border-2 border-grey-05 rounded-xl cursor-pointer'
                  >
                    <div className='w-full flex justify-between items-center'>
                      <Typography variant='title02'>인스타그램</Typography>
                      <IoIosArrowForward className='text-blue-10 text-xl' />
                    </div>
                    <Typography variant='caption02' className='text-grey-40'>
                      @인스타아이디
                    </Typography>
                  </a>
                  <a
                    href={departmentLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex-1 px-5 py-4 gap-2 flex flex-col border-2 border-grey-05 rounded-xl cursor-pointer'
                  >
                    <div className='w-full flex justify-between items-center'>
                      <Typography variant='title02'>학교 공식 홈페이지</Typography>
                      <IoIosArrowForward className='text-blue-10 text-xl' />
                    </div>
                    <Typography variant='caption02' className='text-grey-40'>
                      @링크링크
                    </Typography>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-6'>
            <div className='px-3 flex border-b-1 border-grey-10'>
              {['학과일정', '학생회 공지사항'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as '학과일정' | '학생회 공지사항')}
                  className={`flex-1 py-3 text-center font-semibold cursor-pointer ${
                    activeTab === tab ? 'text-blue-35 border-b-2 border-blue-35' : 'text-grey-40'
                  }`}
                >
                  <Typography variant='title02'>{tab}</Typography>
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
