import { Link } from 'react-router-dom';
import LoginForm from '../../components/organisms/LoginForm';

const Login = () => {
  return (
    <div className='bg-grey-05 flex h-full w-full flex-col p-12 py-[30%] md:mx-auto md:min-h-screen md:w-[1280px] md:py-10'>
      <p className='text-mju-primary mb-4 text-2xl font-bold md:text-4xl'>로그인</p>
      <div className='mx-auto flex w-full items-center justify-center'>
        <div className='flex w-[375px] flex-col md:w-[672px] md:gap-6'>
          <div className='mx-auto flex w-[80%] items-center rounded-xl bg-white p-6 md:min-h-[480px] md:w-full'>
            <LoginForm />
          </div>

          <div className='md:text-md mt-4 flex w-[375px] justify-center gap-4 text-sm md:w-full md:gap-20'>
            <p className='font-normal text-[#999999]'>아이디 찾기</p>
            <p className='font-normal text-[#999999]'>|</p>
            <Link to={'/find-pw'}>
              <p className='font-normal text-[#999999]'>비밀번호 찾기</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
