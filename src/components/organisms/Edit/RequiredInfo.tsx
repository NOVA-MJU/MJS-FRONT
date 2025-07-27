import { useAuthStore } from '../../../store/useAuthStore';
import InputField from '../../molecules/common/InputField';
import Label from '../../atoms/Label';
import Button from '../../atoms/Button';
import { changePassword } from '../../../api/mypage';
import { AxiosError } from 'axios';

type RequiredInfoProps = {
  currentPw: string;
  setCurrentPw: (val: string) => void;
  pw: string;
  setPw: (val: string) => void;
  confirmPw: string;
  setConfirmPw: (val: string) => void;
  openForm: boolean;
  setOpenForm: (val: boolean) => void;
};

const RequiredInfo: React.FC<RequiredInfoProps> = ({
  currentPw,
  setCurrentPw,
  pw,
  setPw,
  confirmPw,
  setConfirmPw,
  openForm,
  setOpenForm,
}) => {
  const user = useAuthStore((state) => state.user);
  const isPwMatch = pw === confirmPw;
  const confirmError = confirmPw !== '' && !isPwMatch;

  const handlePwChange = async () => {
    if (!currentPw || !pw || !confirmPw) {
      alert('모든 비밀번호 항목을 입력해주세요.');
      return;
    }
    if (!isPwMatch) {
      alert('[MJS] 새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await changePassword(currentPw, pw);
      alert('[MJS] 비밀번호가 변경되었습니다.');
      setOpenForm(false);
      setCurrentPw('');
      setPw('');
      setConfirmPw('');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message = axiosError.response?.data?.message ?? '비밀번호 변경에 실패했습니다.';
      alert(message);
    }
  };
  return (
    <div
      className={`w-[648px] ${
        openForm ? 'h-[718px]' : 'h-[308px]'
      } bg-white flex flex-col justify-center items-center rounded-2xl`}
    >
      <div className='w-[440px] flex flex-col gap-12 '>
        <InputField
          label={'이메일'}
          placeholder={`${user?.email ?? ''}`}
          type={'text'}
          value={user?.email ?? ''}
          disabled={true}
          helperText={'이메일은 수정할 수 없습니다.'}
        />
        <div className='flex flex-col gap-4'>
          {!openForm && <Label lab={'비밀번호 변경'} disabled={false} />}

          {openForm && (
            <form
              className='flex flex-col gap-6'
              onSubmit={(e) => {
                e.preventDefault();
                handlePwChange();
              }}
            >
              <InputField
                label='현재 비밀번호'
                placeholder='현재 비밀번호를 입력하세요'
                type='password'
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
              />
              <div className='flex flex-col ml-1'>
                <p className='text-xs font-normal text-grey-40'>8~16자의 영문 대소문자</p>
                <p className='text-xs font-normal text-grey-40'>숫자 1개 이상 포함</p>
                <p className='text-xs font-normal text-grey-40'>특수문자 1개 이상 포함</p>
              </div>
              <InputField
                label='새 비밀번호'
                placeholder='새 비밀번호를 입력하세요'
                type='password'
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />

              <InputField
                label='새 비밀번호 확인'
                type='password'
                autoComplete='new-password'
                placeholder='비밀번호를 다시 입력하세요'
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                error={confirmError}
                helperText={confirmError ? '입력한 비밀번호와 일치하지 않습니다.' : ''}
              />
              <Button
                variant='main'
                type='submit'
                size='md'
                shape='rounded'
                disabled={false}
                fullWidth={true}
                fontWeight={300}
              >
                비밀번호 변경하기
              </Button>
            </form>
          )}
          <Button
            variant='greyBlack'
            size='md'
            shape='rounded'
            disabled={false}
            fullWidth={true}
            fontWeight={300}
            onClick={() => setOpenForm(!openForm)}
          >
            {openForm ? '변경 취소' : '비밀번호 변경하기'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequiredInfo;
