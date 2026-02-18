import FindPwForm from '../../components/organisms/FindForm/FindPwForm';

/**
 * 비밀번호 찾기 페이지
 *
 * 사용자가 가입 시 등록한 정보를 통해 비밀번호를 재설정할 수 있는 페이지입니다.
 */
export default function FindPasswordPage() {
  return (
    <div className='bg-grey-05 flex h-full w-full flex-col p-12 py-[30%] md:mx-auto md:min-h-screen md:w-[1280px] md:py-10'>
      <p className='text-mju-primary mb-4 text-2xl font-bold md:text-4xl'>비밀번호 찾기</p>

      <div className='mx-auto flex w-full items-center justify-center'>
        <div className='flex w-full flex-col md:w-[672px] md:gap-6'>
          <div className='mx-auto flex w-full items-start justify-center rounded-xl bg-white p-6 md:min-h-[480px]'>
            <FindPwForm />
          </div>
        </div>
      </div>
    </div>
  );
}
