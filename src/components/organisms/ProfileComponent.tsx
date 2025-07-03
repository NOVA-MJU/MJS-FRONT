import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Avatar from '../atoms/avatar/Avatar';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../atoms/button';
interface ProfileComponentProps {
  className?: string;
}

const ProfileComponent = ({ className = '' }: ProfileComponentProps) => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return (
      <div
        className={`w-full  flex flex-col border border-gray-300 rounded-md p-4 font-sans ${className}`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar size={50} />
            <div className='flex flex-col'>
              <span className='font-bold'>일단 아무거나.</span>
              <span className='text-sm text-gray-500'>user@email.com</span>
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
          <Link to='/profile' className='text-[#17171b] hover:underline'>
            MyPage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full  flex flex-col justify-center items-center gap-4 border border-gray-300 rounded-md p-6 font-sans ${className}`}
    >
      <span className='text-sm font-semibold text-gray-700'>
        커뮤니티 이용을 위한 <span className='text-blue-900'>로그인</span>이 필요합니다!
      </span>

      <div className='flex flex-col gap-2 w-full max-w-[250px]'>
        <Button variant='main' disabled={false} size='md' fullWidth>
          로그인
        </Button>
        <Button variant='basic' disabled={false} size='md' fullWidth>
          회원가입
        </Button>
      </div>

      <div className='flex gap-2 text-xs text-gray-400 font-medium mt-2'>
        <button className='hover:underline'>아이디 찾기</button>
        <span>|</span>
        <button className='hover:underline'>비밀번호 찾기</button>
      </div>
    </div>
  );
};

export default ProfileComponent;
