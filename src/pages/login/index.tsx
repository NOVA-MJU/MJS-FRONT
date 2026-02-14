import { Link } from 'react-router-dom';
import LoginForm from '../../components/organisms/LoginForm';

const Login = () => {
  return (
    <div className='bg-grey-02 flex h-full w-full flex-col items-center justify-center py-[30%] md:mx-auto md:min-h-screen md:w-[1280px] md:py-10'>
      <div className='w-[90%] md:w-[672px]'>
        <p className='text-title01 mb-3 font-bold text-black md:text-4xl'>로그인</p>
        <div className='mx-auto flex w-full items-center justify-center'>
          <div className='flex w-full flex-col md:w-[672px] md:gap-6'>
            <div className='mx-auto flex w-full flex-col items-center rounded-xl bg-white p-6 md:min-h-[480px] md:w-full'>
              <LoginForm />
              <div className='mt-6 flex w-full justify-center gap-[10%] md:gap-20'>
                <p className='text-caption02 text-grey-20'>아이디 찾기</p>
                <p className='text-caption02 text-grey-20'>|</p>
                <Link to={'/find-pw'}>
                  <p className='text-caption02 text-grey-20'>비밀번호 찾기</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
