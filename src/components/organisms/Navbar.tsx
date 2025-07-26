import { Link } from 'react-router-dom';
import logo from '../../assets/schoolLogo.png';

const Navbar = () => {
  return (
    <>
      <nav className='min-w-[1280px] w-full bg-[#002f6c] p-3 z-50 mx-auto'>
        <div className='max-w-[1200px] w-[90%] mx-auto flex justify-between items-center'>
          {/* 로고 + 이름 */}
          <Link to='/'>
            <div className='flex items-center gap-3'>
              <img src={logo} alt='Logo' className='w-10 h-10' />
              <div className='flex text-white text-xl font-bold no-underline'>
                <span>MJ</span>
                <span className='text-sky-300'>S</span>
              </div>
            </div>
          </Link>

          <ul className='flex  gap-3 list-none  text-white text-sm font-medium'>
            <li>
              <span className='px-3 py-2 rounded cursor-default text-white/60'>학과정보</span>
            </li>
            <li>
              <Link to='/menu' className='p-3'>
                식단
              </Link>
            </li>
            <li>
              <span className='px-3 py-2 rounded cursor-default text-white/60'>벼룩시장</span>
            </li>
            <li>
              <span className='px-3 py-2 rounded cursor-default text-white/60'>제휴</span>
            </li>
            <li>
              <Link to='/notice' className='p-3'>
                공지사항
              </Link>
            </li>
            <li>
              <Link to='/board' className='p-3'>
                검색게시판
              </Link>
            </li>
            <li>
              <span className='px-3 py-2 rounded cursor-default text-white/60'>취업후기</span>
            </li>
            <li>
              <a
                href='https://namu.wiki/w/%EB%AA%85%EC%A7%80%EB%8C%80%ED%95%99%EA%B5%90'
                target='_blank'
                rel='noopener noreferrer'
              >
                띵지위키
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
