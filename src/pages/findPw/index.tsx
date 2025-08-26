import FindPwForm from '../../components/organisms/FindForm/FindPwForm';

const FindPw = () => {
  return (
    <div className='w-full py-[30%] md:py-10 h-full bg-grey-05 md:w-[1280px] md:min-h-screen flex flex-col md:mx-auto p-12'>
      <p className='text-2xl mb-4 md:text-4xl font-bold text-mju-primary'>비밀번호 찾기</p>

      <div className='w-full mx-auto flex justify-center items-center'>
        <div className='w-full flex flex-col md:gap-6 md:w-[672px]'>
          <div className='mx-auto w-full md:min-h-[480px] bg-white p-6 rounded-xl flex justify-center items-center'>
            <FindPwForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindPw;
