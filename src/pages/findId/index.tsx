import FindIdForm from '../../components/organisms/FindForm/FindIdForm';

const FindId = () => {
  return (
    <div className='w-full py-[30%] md:py-10 h-full bg-grey-05 md:w-[1280px] md:min-h-screen flex flex-col md:mx-auto p-12'>
      <p className='text-2xl mb-4 md:text-4xl font-bold text-mju-primary'>아이디 찾기</p>
      <div className='w-full mx-auto flex justify-center items-center'>
        <div className='w-[375px] flex flex-col md:gap-6 md:w-[672px]'>
          <div className='flex mx-auto w-[80%] md:w-full md:min-h-[480px] items-center bg-white p-6 rounded-xl'>
            <FindIdForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindId;
