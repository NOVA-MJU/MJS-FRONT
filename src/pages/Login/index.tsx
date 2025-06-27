import React from 'react';
import LoginForm from '../../components/organisms/LoginForm';

const Login: React.FC = () => {
  return (
    <div className='bg-grey-05 w-[1240px] min-h-screen flex flex-col p-12'>
      {/* 제목: 왼쪽 정렬 */}
      <p className='text-4xl font-bold text-blue-900 text-mju-primary'>로그인</p>

      {/* 가운데 정렬 영역 */}
      <div className='w-full flex justify-center items-center'>
        <div className='flex flex-col gap-6 w-[672px]'>
          <p className='text-3xl font-bold text-mju-primary'>필수 정보</p>

          {/* 하얀 박스: 로그인 폼 */}
          <div className='flex w-full min-h-[480px] items-center bg-white p-6 rounded-xl'>
            <LoginForm />
          </div>

          {/* 아이디/비밀번호 찾기 */}
          <div className='flex justify-evenly'>
            <p className='font-normal text-[#999999]'>아이디 찾기</p>
            <p className='font-normal text-[#999999]'>|</p>
            <p className='font-normal text-[#999999]'>비밀번호 찾기</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
