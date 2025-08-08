import LoginForm from '../../components/organisms/LoginForm';

const Login = () => {
  return (
    <div className='w-full py-[30%] h-full bg-grey-05 md:w-[1280px] md:min-h-screen flex flex-col md:mx-auto p-12'>
      {/* 제목: 왼쪽 정렬 */}

      {/* 가운데 정렬 영역 */}
      <p className='text-2xl mb-4 md:text-4xl font-bold text-mju-primary'>로그인</p>
      <div className='w-full mx-auto flex justify-center items-center'>
        <div className='w-[375px] flex flex-col md:gap-6 md:w-[672px]'>
          {/* 하얀 박스: 로그인 폼 */}
          <div className='flex mx-auto w-[80%] md:w-full md:min-h-[480px] items-center bg-white p-6 rounded-xl'>
            <LoginForm />
          </div>

          {/* 아이디/비밀번호 찾기 */}
          <div className='w-[375px] md:w-full mt-4 flex justify-center gap-4 md:gap-20 text-sm md:text-md'>
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
