import clsx from 'clsx';
import { useRef, useState } from 'react';
import { IoIosAdd, IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CloseIcon } from '@/components/atoms/Icon';
import TextareaAutosize from 'react-textarea-autosize';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
import { compressImage } from '@/utils/imageCompression';
import { uploadS3, DOMAIN_VALUES } from '@/api/s3upload';
import toast from 'react-hot-toast';
import { createStudentCouncilNotice, type College, type Department } from '@/api/departments-admin';

const MAX_CONTENT_LENGTH = 2200;
const MAX_MEDIA_COUNT = 20;

export default function DepartmentPostsNewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const college = searchParams.get('college') as College | null;
  const department = searchParams.get('department') as Department | null;

  const [medias, setMedias] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 게시글 이미지 업로드
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // 최대 개수 체크
    if (medias.length + files.length > MAX_MEDIA_COUNT) {
      toast.error(`최대 ${MAX_MEDIA_COUNT}장까지 업로드할 수 있습니다.`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // 이미지 파일 검증
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name}은(는) 이미지 파일이 아닙니다.`);
        }

        // 파일 크기 검증 (50MB)
        const maxSizeMB = 50;
        if (file.size / 1024 / 1024 > maxSizeMB) {
          throw new Error(`${file.name}의 크기가 ${maxSizeMB}MB를 초과합니다.`);
        }

        // 이미지 압축
        const compressedFile = await compressImage(file);

        // S3 업로드
        const url = await uploadS3(compressedFile, DOMAIN_VALUES[4]); // DEPARTMENT_NOTICE

        return url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setMedias((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      toast.error(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      // 파일 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * 사진 추가 버튼 클릭 핸들러
   */
  const handleAddPhotoClick = () => {
    if (medias.length >= MAX_MEDIA_COUNT) {
      toast.error(`최대 ${MAX_MEDIA_COUNT}장까지 업로드할 수 있습니다.`);
      return;
    }
    fileInputRef.current?.click();
  };

  /**
   * 이미지 삭제 핸들러
   */
  const handleRemoveMedia = (indexToRemove: number) => {
    setMedias((prev) => prev.filter((_, index) => index !== indexToRemove));
    // 삭제 후 인덱스 조정
    if (activeIndex >= medias.length - 1 && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  /**
   * 게시글 등록 핸들러
   */
  const handleSubmit = async () => {
    if (!college || !department) {
      toast.error('college, department 정보가 없습니다. 학과 목록에서 다시 접근해 주세요.');
      return;
    }

    if (medias.length === 0) {
      toast.error('이미지를 1장 이상 추가해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createStudentCouncilNotice(college, department, {
        title: null,
        content,
        imageUrls: medias,
      });
      const noticeUuid = response.data?.uuid;
      if (noticeUuid) {
        toast.success('게시물이 등록되었습니다.');
        navigate(`/departments/posts/${noticeUuid}`);
      } else {
        toast.error('게시물 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시물 등록 실패:', error);
      toast.error('게시물 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      {/* 파일 입력 (숨김) */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple
        className='hidden'
        onChange={handleFileSelect}
        disabled={isUploading}
      />

      {/* 헤더: 뒤로가기 + 제목 + 사진 추가 버튼 */}
      <header className='border-grey-10 relative flex h-15 items-center justify-center border-b-1 px-4 py-3'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          className='absolute left-2 cursor-pointer p-2'
          aria-label='뒤로 가기'
        >
          <IoIosArrowBack className='text-2xl text-black' />
        </button>
        <p className='text-body02 text-black'>게시물 작성</p>
        <button
          type='button'
          onClick={handleAddPhotoClick}
          disabled={isUploading || medias.length >= MAX_MEDIA_COUNT}
          className='absolute right-2 cursor-pointer p-2 disabled:cursor-not-allowed disabled:opacity-50'
          aria-label='사진 추가'
        >
          <IoIosAdd className='text-2xl text-black' />
        </button>
      </header>

      <div className='px-5 py-4'>
        <p className='text-body06 text-grey-80'>이미지</p>
        <p className='text-caption02 text-grey-60 mt-1'>*최대 50MB, JPG/PNG, 최대 20장</p>
      </div>

      {/* 미디어 영역 */}
      <div className='bg-grey-02 relative aspect-[4/5] w-full'>
        {medias.length > 0 && (
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
                <button
                  type='button'
                  onClick={() => handleRemoveMedia(index)}
                  className='absolute top-5 right-5 cursor-pointer p-1.5'
                  aria-label='이미지 삭제'
                >
                  <CloseIcon width={24} height={24} />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* 미디어 갯수 인디케이터 */}
      <div className='flex items-center justify-center pt-1 pb-2'>
        {medias.length > 1 && (
          <span className='text-body04 text-grey-80 px-2 py-1'>
            {activeIndex + 1} / {medias.length}
          </span>
        )}
      </div>

      {/* 게시글 입력 영역 */}
      <div className='p-5'>
        <p className='text-body02 text-black'>내용</p>
        <div className='relative'>
          <TextareaAutosize
            className={clsx(
              'no-scrollbar mt-2.5 w-full resize-none p-3 pb-10',
              'border-grey-02 rounded-lg border-2',
              'text-body06 placeholder:text-grey-20 text-black',
            )}
            placeholder='게시글 내용을 입력해 주세요.'
            minRows={4}
            maxLength={MAX_CONTENT_LENGTH}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= MAX_CONTENT_LENGTH) {
                setContent(value);
              }
            }}
            value={content}
          />
          <span className='text-body06 text-grey-20 absolute right-3 bottom-4'>{`${content.length}/${MAX_CONTENT_LENGTH}`}</span>
        </div>
      </div>

      {/* 게시글 등록 버튼 */}
      <button
        type='button'
        onClick={handleSubmit}
        disabled={isSubmitting || medias.length === 0}
        className='bg-grey-02 text-body05 text-grey-40 m-5 w-full cursor-pointer rounded-xl p-2.5 disabled:cursor-not-allowed disabled:opacity-50'
        aria-label='완료'
      >
        {isSubmitting ? '등록 중...' : '완료'}
      </button>
    </section>
  );
}
