import React from 'react';
import RegisterForm from '../../components/organisms/Register/index';

const Register: React.FC = () => (
  <div className='bg-grey-05 mx-auto flex min-h-screen w-full flex-1 flex-col p-4 md:p-12'>
    <p className='text-mju-primary mb-4 text-2xl font-bold md:text-4xl'>회원가입</p>
    <div className='flex items-center justify-center'>
      <RegisterForm />
    </div>
  </div>
);

export default Register;
