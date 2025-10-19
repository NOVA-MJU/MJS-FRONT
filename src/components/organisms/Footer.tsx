export default function Footer() {
  const handleContactClick = () => {
    const email = 'mjsearch2025@gmail.com';
    const subject = encodeURIComponent('문의 내용을 작성해주세요');
    const body = encodeURIComponent(
      '안녕하세요,\n\n문의사항을 아래에 작성해주세요.\n\n- 이름:\n- 연락처:\n- 문의 내용:',
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <footer className='w-full bg-blue-05'>
      <div className='p-5 w-full md:w-[1280px] mx-auto flex flex-col gap-4'>
        <img src='/logo/MJS_lightLogo.svg' alt='mjs' className='h-auto w-14' />
        <div className='flex gap-4'>
          <a className='text-caption05 text-grey-40 cursor-pointer'>이용약관</a>
          <a className='text-caption05 text-grey-40 cursor-pointer'>개인정보 처리방침</a>
          <button
            className='text-caption05 text-grey-40 cursor-pointer'
            onClick={handleContactClick}
          >
            문의하기
          </button>
        </div>
        <p className='text-caption05 text-grey-20'>© 2025 MJS. All rights reserved.</p>
      </div>
    </footer>
  );
}
