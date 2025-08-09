import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Avatar from '../atoms/Avatar';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../atoms/Button';

interface ProfileComponentProps {
  className?: string;
}

/**
 *
 * 로그인 상태에 따라 사용자 프로필 또는 로그인 유도 UI를 표시하는 컴포넌트입니다.
 *
 * - 로그인 상태(`isLoggedIn`이 true)일 경우:
 *   - 프로필이미지, 이름, 이메일 표시
 *   - 로그아웃 버튼: 클릭 시 zustand 스토어와 sessionStorage를 초기화하고
 *     persist 저장소를 비웁니다.
 *   - MSI, MYiCap, Office365 등 외부 링크와 MyPage 내부 링크를 표시합니다.
 *
 * - 비로그인 상태일 경우:
 *   - "로그인" 및 "회원가입" 버튼을 표시하여 각각 해당 페이지로 이동할 수 있습니다.
 *   - "아이디 찾기"와 "비밀번호 찾기" 버튼은 현재 더미 링크(`#`)로 연결되어 있으며,
 *     **추후 실제 경로로 연결 작업이 필요**합니다.
 *
 * @component
 * @param {ProfileComponentProps} props - 컴포넌트 속성
 * @param {string} [props.className] - 외부에서 전달받은 TailwindCSS 클래스명
 * @returns {JSX.Element} 로그인 상태에 따라 다른 UI를 렌더링하는 JSX 요소
 */
const ProfileComponent = ({ className = '' }: ProfileComponentProps) => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const handleLogout = () => {
    // 1) zustand 상태 초기화 + sessionStorage.clear()
    logout();
    // 2) persist에 저장된 값까지 제거 (localStorage/sessionStorage 어디든)
    try {
      useAuthStore.persist.clearStorage();
    } catch (e) {
      console.warn('persist clearStorage failed:', e);
    }
  };

  if (isLoggedIn) {
    return (
      <div
        className={`w-full  flex flex-col border border-grey-05 rounded-md p-4 font-sans ${className}`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar size={50} />
            <div className='flex flex-col'>
              <div>
                <span className='font-bold'>{user?.name}</span>
                <button
                  disabled={false}
                  onClick={handleLogout}
                  className='ml-4 text-sm text-grey-40 cursor-pointer hover:underline'
                >
                  로그아웃
                </button>
              </div>
              <span className='text-sm text-gray-500'>{user?.email}</span>
            </div>
          </div>

          <FaExternalLinkAlt className='text-gray-600 text-base cursor-pointer' />
        </div>

        <div className='w-full h-px bg-gray-300 my-3' />

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
          <Link to={`/mypage/${user?.uuid}`} className='text-[#17171b] hover:underline'>
            MyPage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full  flex flex-col justify-center items-center gap-4 border border-grey-20 rounded-md p-6 font-sans ${className}`}
    >
      <span className='text-sm font-semibold text-gray-700'>
        커뮤니티 이용을 위한 <span className='text-blue-900'>로그인</span>이 필요합니다!
      </span>
      <div className='flex flex-col gap-2 w-full max-w-[250px]'>
        <Link to='login'>
          <Button variant='main' disabled={false} size='md' fullWidth>
            로그인
          </Button>
        </Link>
        <Link to='register'>
          <Button variant='greyLight' disabled={false} size='md' fullWidth>
            회원가입
          </Button>
        </Link>
      </div>
      <div className='flex gap-2 text-xs text-gray-400 font-medium mt-2'>
        <Link to='/#'>
          <button className='hover:underline'>아이디 찾기</button>
        </Link>
        <span>|</span>
        <Link to='/#'>
          <button className='hover:underline'>비밀번호 찾기</button>
        </Link>
      </div>
    </div>
  );
};

export default ProfileComponent;
