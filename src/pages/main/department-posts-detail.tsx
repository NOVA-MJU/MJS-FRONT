import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import Avatar from '@/components/atoms/Avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { FiEdit } from 'react-icons/fi';

// 관리자 권한 체크 헬퍼 함수
const hasAdminPermission = (role: string | undefined): boolean => {
  return role === 'OPERATOR' || role === 'ADMIN';
};

export default function DepartmentPostsDetailPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeIndex, setActiveIndex] = useState(0);

  const post = POST_DETAIL_DUMMY;
  const { authorName, createdAt, medias, content } = post;
  const mediaCount = medias.length;

  return (
    <section>
      {/* 헤더: 뒤로가기 + 제목 */}
      <header className='border-grey-10 relative flex h-15 items-center justify-center border-b-1 px-4 py-3'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='absolute left-3 cursor-pointer p-0.5'
          aria-label='뒤로 가기'
        >
          <IoIosArrowBack className='text-2xl text-black' />
        </button>
        <p className='text-body02 text-black'>게시물</p>

        {/* 관리자 권한이 있는 경우 수정 버튼 표시 */}
        {hasAdminPermission(user?.role) && (
          <Link
            to={`/departments/posts/edit/${post.uuid}`}
            type='button'
            className='absolute right-4 cursor-pointer p-1'
          >
            <FiEdit className='text-grey-30 text-xl' />
          </Link>
        )}
      </header>

      {/* 작성자 정보 */}
      <div className='flex items-center gap-3 px-5 py-3.5'>
        <Avatar className='h-8 w-8 shrink-0' />
        <span className='text-body06 text-black'>{authorName}</span>
      </div>

      {/* 미디어 영역 */}
      <div className='bg-grey-02 relative aspect-[4/5] w-full'>
        <Swiper
          className='h-full w-full'
          slidesPerView={1}
          onSlideChange={(swiper: SwiperClass) => setActiveIndex(swiper.activeIndex)}
          initialSlide={0}
        >
          {medias.map((media, index) => (
            <SwiperSlide key={index} className='h-full w-full'>
              <img
                src={media}
                alt={`게시물 미디어 ${index + 1}`}
                className='h-full w-full object-cover'
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {mediaCount > 1 && (
          <span className='text-caption02 bg-grey-40 absolute top-5 right-5 z-10 rounded-lg px-2 py-1 text-white'>
            {activeIndex + 1}
            {' / '}
            {mediaCount}
          </span>
        )}
      </div>

      {/* 게시물 본문 및 날짜 */}
      <div className='p-5'>
        <p className='text-body05 text-grey-80 whitespace-pre-wrap'>{content}</p>
        <p className='text-caption02 text-grey-30 mt-2'>
          {format(new Date(createdAt), 'yyyy.MM.dd', { locale: ko })}
        </p>
      </div>
    </section>
  );
}

// 더미 데이터
const POST_DETAIL_DUMMY = {
  uuid: '1234567890',
  authorName: '작성자 이름',
  createdAt: '2025-01-15T10:00:00.000Z',
  content: `Lorem ipsum dolor sit amet consectetur. Diam turpis nisl enim sit at amet eu sit. Vitae nec cum amet leo nibh. Quis vitae blandit accumsan ultrices blandit volutpat massa elementum vel. Ut bibendum euismod mauris commodo diam tristique volutpat quam. Leo mauris ipsum suscipit adipiscing pharetra.`,
  medias: [
    'https://www.visitdubai.com/-/media/images/leisure/campaigns/delicious-dubai-nordics/nordics-campaign-arabic-food-dubai-header-2.jpg?&cw=256&ch=256',
    'https://cookingqueens.nl/wp-content/uploads/2020/05/Arabische-platter.jpg',
    'https://arabiacatering.nl/wp-content/uploads/2020/03/pita-4576076_640.jpg',
    'https://media.triple.guide/triple-cms/c_fill,f_auto,h_256,w_256/ca370307-375e-47ec-a6d6-5d286eb849c2.jpeg',
    'https://media.triple.guide/triple-cms/c_fill,f_auto,h_256,w_256/3334d4c1-1eb3-457c-ad92-76c916b0e838.jpeg',
  ],
};
