import React from 'react';
import RegisterForm from '../../components/organisms/Register/index';

/**
 * 회원가입 페이지
 *
 * 새로운 사용자 회원가입을 위한 페이지입니다.
 * 필수 정보와 개인 정보를 입력받습니다.
 */
const Register: React.FC = () => {
  return (
    <div className='w-full flex-1 bg-grey-05 min-h-screen flex flex-col mx-auto p-4 md:p-12'>
      <p className='text-2xl mb-4 md:text-4xl font-bold text-mju-primary'>회원가입</p>
      <div className='flex justify-center items-center'>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
