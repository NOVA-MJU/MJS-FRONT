import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography } from '../../../components/atoms/Typography';
import DepartmentNoticeItem from '../../../components/molecules/DepartmentNoticeItem';
import Calendar from '../../../components/organisms/Calendar';
import Pagination from '../../../components/molecules/common/Pagination';
import { getDepartmentDetail, type DepartmentDetailRes } from '../../../api/departments';

export default function DepartmentDetail() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'학과일정' | '학생회 공지사항'>('학과일정');
  const [noticeItems] = useState(x);
  const [department, setDepartment] = useState<DepartmentDetailRes | null>(null);

  useEffect(() => {
    const getData = async () => {
      if (!uuid) return;
      setIsLoading(true);

      try {
        setDepartment(await getDepartmentDetail(uuid));
      } catch (e) {
        setIsError(true);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [uuid]);

  return (
    <div className='flex-1 p-7 flex flex-col gap-12'>
      <button
        className='h-12 flex items-center gap-2.5 cursor-pointer'
        onClick={() => navigate(-1)}
      >
        <IoIosArrowBack className='text-blue-10 text-xl' />
        <Typography variant='body03' className='text-blue-10'>
          이전
        </Typography>
      </button>
      {!isLoading && !isError && (
        <>
          <div className='flex gap-6'>
            {department?.studentCouncilLogo && (
              <img
                src={department.studentCouncilLogo}
                alt='학과이미지'
                className='w-46 h-46 rounded-full object-cover'
              />
            )}
            <div className='flex-1 flex flex-col gap-6'>
              <div className='flex flex-col gap-3'>
                <button className='w-fit px-2 py-0.5 rounded-sm bg-blue-05'>
                  <Typography variant='body03' className='text-blue-20'>
                    {department?.college}
                  </Typography>
                </button>
                <div className='flex items-center gap-6'>
                  <Typography variant='heading01'>{department?.departmentName}</Typography>
                  <div className='w-0.5 h-8 bg-blue-05' />
                  <Typography variant='body01'>{department?.slogan}</Typography>
                </div>
                <div className='p-6 gap-2.5 bg-grey-05 rounded-xl'>
                  <Typography variant='body03' className='text-grey-40'>
                    {department?.description}
                  </Typography>
                </div>
                <div className='flex gap-6'>
                  <a
                    href={department?.instagramUrl}
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
                    href={department?.homepageUrl}
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
              <div className='p-6'>
                <Calendar />
              </div>
            ) : (
              <div className='p-3 flex flex-col gap-3'>
                {noticeItems.map((item) => (
                  <DepartmentNoticeItem
                    imageUrl={item.imageUrl}
                    title={item.title}
                    content={item.content}
                    date={item.date}
                  />
                ))}
                <Pagination page={1} totalPages={2} onChange={() => 0} />
              </div>
            )}
          </div>
        </>
      )}
      {isError && (
        <div className='flex-1 flex justify-center items-center'>
          <Typography variant='heading01'>문제가 발생했습니다</Typography>
        </div>
      )}
    </div>
  );
}

const x = [
  {
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDAnmNUf-EgecHeBwTA1fld6hdWifH9uJLVmxVU3UrRkBW0C43iIdGiTjMK-D_BfAL33E&usqp=CAU',
    title: '제목',
    content: '미리보기가 어쩌고',
    date: '2025.07.17',
  },
  {
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDAnmNUf-EgecHeBwTA1fld6hdWifH9uJLVmxVU3UrRkBW0C43iIdGiTjMK-D_BfAL33E&usqp=CAU',
    title: '제목',
    content: '미리보기가 어쩌고',
    date: '2025.07.17',
  },
  {
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDAnmNUf-EgecHeBwTA1fld6hdWifH9uJLVmxVU3UrRkBW0C43iIdGiTjMK-D_BfAL33E&usqp=CAU',
    title: '제목',
    content: '미리보기가 어쩌고',
    date: '2025.07.17',
  },
  {
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDAnmNUf-EgecHeBwTA1fld6hdWifH9uJLVmxVU3UrRkBW0C43iIdGiTjMK-D_BfAL33E&usqp=CAU',
    title: '제목',
    content: '미리보기가 어쩌고',
    date: '2025.07.17',
  },
  {
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDAnmNUf-EgecHeBwTA1fld6hdWifH9uJLVmxVU3UrRkBW0C43iIdGiTjMK-D_BfAL33E&usqp=CAU',
    title: '제목',
    content: '미리보기가 어쩌고',
    date: '2025.07.17',
  },
  {
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDAnmNUf-EgecHeBwTA1fld6hdWifH9uJLVmxVU3UrRkBW0C43iIdGiTjMK-D_BfAL33E&usqp=CAU',
    title: '제목',
    content: '미리보기가 어쩌고',
    date: '2025.07.17',
  },
  {
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDAnmNUf-EgecHeBwTA1fld6hdWifH9uJLVmxVU3UrRkBW0C43iIdGiTjMK-D_BfAL33E&usqp=CAU',
    title: '제목',
    content: '미리보기가 어쩌고',
    date: '2025.07.17',
  },
];
