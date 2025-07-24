import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Typography } from '../../components/atoms/Typography';
import { useState } from 'react';
import Calendar from '../../components/organisms/Calendar';
import DepartmentNoticeItem from '../../components/molecules/DepartmentNoticeItem';
import Pagination from '../../components/molecules/common/Pagination';
import { useNavigate } from 'react-router-dom';

export default function Department() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'학과일정' | '학생회 공지사항'>('학과일정');
  const [noticeItems] = useState(dummy);
  const [departmentImage] = useState(
    'https://image.dongascience.com/Photo/2018/06/f29d4495edc789c8261c014af17e988a.jpg',
  );

  return (
    <div className='p-7 flex flex-col gap-12'>
      <button
        className='h-12 flex items-center gap-2.5 h-6 cursor-pointer'
        onClick={() => navigate(-1)}
      >
        <IoIosArrowBack className='text-blue-10 text-xl' />
        <Typography variant='body03' className='text-blue-10'>
          이전
        </Typography>
      </button>

      <div className='flex gap-6'>
        <img
          src={departmentImage}
          alt='학과이미지'
          className='w-46 h-46 rounded-full object-cover'
        />

        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-3'>
            <button className='w-fit px-2 py-0.5 rounded-sm bg-blue-05'>
              <Typography variant='body03' className='text-blue-20'>
                소속대학
              </Typography>
            </button>

            <div className='flex items-center gap-6'>
              <Typography variant='heading01'>학과명</Typography>
              <div className='w-0.5 h-8 bg-blue-05' />
              <Typography variant='body01'>슬로건 어쩌구 저쩌구</Typography>
            </div>

            <div className='p-6 gap-2.5 bg-grey-05 rounded-xl'>
              <Typography variant='body03' className='text-grey-40'>
                한줄소개어쩌구저쩌구이러쿵저러쿵한줄소개어쩌구저쩌구이러쿵저러쿵한줄소개어쩌구저쩌구이러쿵저러쿵한줄소개어쩌구저쩌구이러쿵저러쿵한줄소개어쩌구저쩌구이러쿵저러쿵한줄소개어쩌구저쩌구이러쿵저러쿵한줄소개어쩌구저쩌구이러쿵저러쿵한줄소개어쩌구저쩌구이러쿵저러쿵
              </Typography>
            </div>

            <div className='flex gap-6'>
              <button className='flex-1 px-5 py-4 gap-2 flex flex-col border-2 border-grey-05 rounded-xl cursor-pointer'>
                <div className='w-full flex justify-between items-center'>
                  <Typography variant='title02'>인스타그램</Typography>
                  <IoIosArrowForward className='text-blue-10 text-xl' />
                </div>
                <Typography variant='caption02' className='text-grey-40'>
                  @인스타아이디
                </Typography>
              </button>
              <button className='flex-1 px-5 py-4 gap-2 flex flex-col border-2 border-grey-05 rounded-xl cursor-pointer'>
                <div className='w-full flex justify-between items-center'>
                  <Typography variant='title02'>학교 공식 홈페이지</Typography>
                  <IoIosArrowForward className='text-blue-10 text-xl' />
                </div>
                <Typography variant='caption02' className='text-grey-40'>
                  @링크링크
                </Typography>
              </button>{' '}
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
    </div>
  );
}

const dummy = [
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
