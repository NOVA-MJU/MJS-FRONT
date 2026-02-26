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
    <footer className='bg-blue-05 w-full'>
      <div className='mx-auto flex w-full flex-col items-center gap-3 px-5 py-6 md:w-[1280px]'>
        <div className='text-caption04 text-grey-40 flex w-full max-w-[480px] items-center justify-center gap-8'>
          <a className='cursor-pointer'>이용약관</a>
          <span className='text-grey-30 select-none'>|</span>
          <a className='cursor-pointer whitespace-nowrap'>개인정보 처리방침</a>
          <span className='text-grey-30 select-none'>|</span>
          <button className='cursor-pointer whitespace-nowrap' onClick={handleContactClick}>
            문의하기
          </button>
        </div>
        <p className='text-caption05 text-grey-20'>@ 2025 MJS. All rights reserved</p>
      </div>
    </footer>
  );
}
