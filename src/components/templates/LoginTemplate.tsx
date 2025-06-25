import React from 'react';
import LoginForm from '../organisms/LoginForm';
import { colors } from '../../styles/color';

const LoginTemplate: React.FC = () => {
  return (
    <div
      className='w-full min-h-screen p-12 flex flex-col items-start'
      style={{ backgroundColor: colors.grey02 }}
    >
      <p className='text-4xl font-bold mb-6' style={{ color: colors.blue35 }}>
        로그인
      </p>

      <div className='w-full flex justify-center'>
        <div className='flex flex-col gap-6 w-[672px]'>
          <p className='text-3xl font-bold'>필수 정보</p>
          <div className='bg-white p-6 rounded-xl'>
            <LoginForm />
          </div>
          <div
            className='flex justify-evenly text-sm text-gray-500'
            style={{ color: colors.grey40 }}
          >
            <p>아이디 찾기</p>
            <p>|</p>
            <p>비밀번호 찾기</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTemplate;
