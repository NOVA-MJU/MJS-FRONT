import logo from '../../IMG/schoolLogoWithNewColor.png';

const Footer = () => {
  const handleContactClick = () => {
    const email = 'mjsearch2025@gmail.com';
    const subject = encodeURIComponent('MJS NOVA 문의드립니다');
    const body = encodeURIComponent(
      '안녕하세요,\n\n문의사항을 아래에 작성해주세요.\n\n- 이름:\n- 연락처:\n- 문의 내용:',
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <footer className='w-full bg-white py-4'>
      <div className='max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4'>
        <div className='flex items-center gap-2'>
          <img src={logo} alt='Logo' className='w-10 h-10' />
          <span className='text-lg font-bold text-gray-800'>
            MJ<span className='text-sky-400'>S</span> NOVA
          </span>
        </div>

        <ul className='flex gap-6 text-sm text-gray-800'>
          <li className='hover:text-gray-600 hover:underline cursor-pointer'>이용 약관</li>
          <li className='hover:text-gray-600 hover:underline cursor-pointer'>개인정보 처리방침</li>
          <li
            className='hover:text-gray-600 hover:underline cursor-pointer'
            onClick={handleContactClick}
          >
            문의하기
          </li>
        </ul>

        <p className='text-xs text-gray-400 text-right w-full md:w-auto'>
          © 2025 MJS. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
