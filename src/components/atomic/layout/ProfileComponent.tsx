import { Link } from 'react-router-dom';

import { FaExternalLinkAlt } from 'react-icons/fa';
// import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
interface ProfileComponentProps {
  className: string;
}

const ProfileComponent = ({ className }: ProfileComponentProps) => {
  //dummy
  const isLoggedIn = true;
  // const [isLoading, setIsLoading] = useState(true);
  // const [isError, setIsError] = useState(false);
  // const [userInfo, setUserInfo] = useState<any>(null);

  // const handleLoginClick = () => navigate('/login');
  // const handleProfileClick = () => navigate('/profile');
  // const handleLogoutClick = async () => {
  //   await logout();
  //   window.location.reload();
  // };

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (isLoggedIn) {
  //       try {
  //         const response = await getUserInfo();
  //         setUserInfo(response.data);
  //       } catch (e) {
  //         console.error(e);
  //         setIsError(true);
  //         await logout();
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     } else {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchUserData();
  // }, [isLoggedIn]);

  // if (isLoading) {
  //   return (
  //     <div className='w-full h-full flex justify-center items-center border border-gray-300 rounded-md p-4'>
  //       <LoadingComponent message='프로필 정보 로딩중입니다.' />
  //     </div>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <div className='w-full h-full flex flex-col justify-center items-center border border-gray-300 rounded-md p-4'>
  //       <span className='text-2xl font-semibold text-red-600'>오류가 발생했습니다</span>
  //     </div>
  //   );
  // }

  return isLoggedIn ? (
    <div
      className={`w-full h-full flex flex-col border border-gray-300 rounded-md p-4 font-sans ${className}`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Avatar size={50} />
          <div className='flex flex-col'>
            {/* <span className='text-base font-bold text-black'>{userInfo?.nickname}</span>
            <span className='text-sm text-gray-500'>{userInfo?.email}</span> */}
            <span>일단 아무거나.</span>
          </div>
        </div>
        <FaExternalLinkAlt className='text-gray-600 text-base cursor-pointer' />
      </div>

      {/* 구분선 */}
      <div className='w-full h-px bg-gray-300 my-3' />

      {/* 네비게이션 */}
      <div className='flex justify-around text-sm font-bold'>
        <a
          href='https://msi.mju.ac.kr'
          target='_blank'
          rel='noopener noreferrer'
          className='text-[#012968] hover:underline'
        >
          MSI
        </a>
        <a
          href='https://myicap.mju.ac.kr'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:underline'
        >
          <span className='text-[#0386d0]'>MY</span>
          <span className='text-gray-500'>i</span>
          <span className='text-[#002968]'>Cap</span>
        </a>
        <a
          href='https://mcloud.mju.ac.kr'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:underline'
        >
          <span className='text-[#17171b]'>Office</span>
          <span className='text-[#ef6700]'>365</span>
        </a>
        <Link to='/profile' className='text-[#17171b] hover:underline'>
          MyPage
        </Link>
      </div>
    </div>
  ) : (
    <div className='w-full h-full flex flex-col justify-center items-center gap-4 border border-gray-300 rounded-md p-4'>
      <span className='text-gray-800 font-semibold'>
        커뮤니티 이용을 위한 <span className='text-blue-900'>로그인</span>이 필요합니다!
      </span>
      <button className='w-[100px] h-[30px] bg-[#001f5c] text-white rounded-md font-bold text-base transition-transform hover:scale-110 hover:bg-blue-900 active:scale-95'>
        로그인
      </button>
    </div>
  );
};

export default ProfileComponent;
