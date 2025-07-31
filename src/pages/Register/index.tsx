import React from 'react';
import RegisterForm from '../../components/organisms/Register/index';

const Register: React.FC = () => (
  <div className='bg-grey-05 w-[1280px] min-h-screen flex flex-col mx-auto p-12'>
    <p className='text-4xl font-bold text-blue-900 text-mju-primary'>회원가입</p>
    <div className='w-full flex justify-center items-center'>
      <RegisterForm />
    </div>
  </div>
);

export default Register;
