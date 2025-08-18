import React from 'react';
import RegisterForm from '../../components/organisms/Register/index';
import { Typography } from '../../components/atoms/Typography';

const Register: React.FC = () => (
  <div className='w-full flex-1 bg-grey-05 min-h-screen flex flex-col mx-auto p-4 md:p-12'>
    <Typography variant='heading01' className='text-mju-primary'>
      회원가입
    </Typography>
    <div className='flex justify-center items-center'>
      <RegisterForm />
    </div>
  </div>
);

export default Register;
