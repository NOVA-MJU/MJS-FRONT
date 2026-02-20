import { InfoCircleIcon } from '@/components/atoms/Icon';
import { useResetPassword } from '@/hooks/useFindPw';
import clsx from 'clsx';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

/**
 * 비밀번호 조건: 8~16자 영문 대소문자, 숫자 1개 이상, 특수문자 1개 이상
 */
function isValidPassword(pw: string): boolean {
  if (!pw || pw.length < 8 || pw.length > 16) return false;
  if (!/[a-zA-Z]/.test(pw)) return false;
  if (!/\d/.test(pw)) return false;
  if (!/[^a-zA-Z0-9]/.test(pw)) return false;
  return true;
}

interface FindPasswordStep1Props {
  email: string;
}

export default function FindPasswordStep1({ email }: FindPasswordStep1Props) {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const pwValid = isValidPassword(password);
  const pwError = password.length > 0 && !pwValid;
  const checkError = passwordCheck.length > 0 && password !== passwordCheck;
  const isReady = pwValid && password === passwordCheck;

  const { reset, loading: isChanging } = useResetPassword();

  const handleChangePassword = async () => {
    if (!isReady || isChanging) return;
    try {
      await reset(email, password);
      toast.success('비밀번호가 변경되었습니다.');
      navigate('/login', { replace: true });
    } catch {
      toast.error('비밀번호 변경에 실패했습니다.');
    }
  };
  return (
    <div className='bg-grey-02 flex-1'>
      <div className='flex flex-col gap-3 px-5 py-7.5'>
        <p className='text-title01 text-black'>비밀번호 재설정</p>
        <div className='flex flex-col rounded-xl bg-white p-6'>
          {/* 새 비밀번호 입력칸 */}
          <p className={clsx('text-body04 transition', pwError ? 'text-error' : 'text-grey-80')}>
            새 비밀번호
          </p>
          <input
            type='password'
            placeholder='새 비밀번호를 입력하세요'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={clsx(
              'placeholder:text-body06 placeholder:text-grey-20 mt-2 rounded-lg border p-3 transition',
              pwError ? 'border-error' : 'border-grey-10',
            )}
          />
          <span
            className={clsx(
              'text-caption02 mt-2 transition',
              pwError ? 'text-error' : 'text-grey-30',
            )}
          >
            8~16자의 영문 대소문자
            <br />
            숫자 1개 이상 포함
            <br />
            특수문자 1개 이상 포함
          </span>

          {/* 비밀번호 확인 입력칸 */}
          <p
            className={clsx(
              'text-body04 mt-5 transition',
              checkError ? 'text-error' : 'text-grey-80',
            )}
          >
            새 비밀번호 확인
          </p>
          <input
            type='password'
            placeholder='새 비밀번호를 다시 입력하세요'
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            className={clsx(
              'placeholder:text-body06 placeholder:text-grey-20 mt-2 rounded-lg border p-3 transition',
              checkError ? 'border-error' : 'border-grey-10',
            )}
          />
          {checkError && (
            <div className='text-error mt-2 flex items-center gap-1'>
              <InfoCircleIcon />
              <span className='text-caption04'>입력한 비밀번호가 일치하지 않습니다.</span>
            </div>
          )}

          <button
            type='button'
            className={clsx(
              'text-body05 mt-7 cursor-pointer rounded-lg p-2.5 transition',
              isReady ? 'bg-mju-primary text-white' : 'bg-grey-40 text-white',
            )}
            disabled={!isReady || isChanging}
            onClick={handleChangePassword}
          >
            {isChanging ? '변경 중...' : '비밀번호 변경'}
          </button>
        </div>
      </div>
    </div>
  );
}
