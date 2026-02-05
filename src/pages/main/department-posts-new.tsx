import clsx from 'clsx';
import { useState } from 'react';
import { IoIosAdd, IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';

const MAX_CONTENT_LENGTH = 2200;

export default function DepartmentPostsNewPage() {
  const navigate = useNavigate();

  const [medias] = useState<string[]>([]);
  const [currentMediaIndex] = useState(0);
  const [content, setContent] = useState('');

  return (
    <section>
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
          className='absolute right-2 cursor-pointer p-2'
          aria-label='사진 추가'
        >
          <IoIosAdd className='text-2xl text-black' />
        </button>
      </header>

      <div className='px-5 py-4'>
        <p className='text-body06 text-grey-80'>이미지</p>
        <p className='text-caption02 text-grey-60 mt-1'>*최대 50MB, JPG/PNG, 최대 20장</p>
      </div>

      {/* 미디어 영역 (추후 swiper 적용 예정) */}
      <div className='bg-grey-02 relative aspect-[4/5] w-full'>
        {medias.length > 0 && (
          <img
            src={medias[currentMediaIndex - 1]}
            alt='게시물 미디어'
            className='h-full w-full object-cover'
          />
        )}
      </div>

      {medias.length > 0 && (
        <p className='text-body04 text-grey-80 mt-2 justify-self-center'>
          {`${currentMediaIndex} / ${medias.length}`}
        </p>
      )}

      {/* 게시글 입력 영역 */}
      <div className='mt-3 p-5'>
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
        className='bg-grey-02 text-body05 text-grey-40 m-5 w-full cursor-pointer rounded-xl p-2.5'
        aria-label='완료'
      >
        완료
      </button>
    </section>
  );
}
