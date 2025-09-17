import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../molecules/common/InputField';
import Button from '../../atoms/Button/Button';
import {
  useSendRecoveryEmail,
  useVerifyRecoveryCode,
  useResetPassword,
} from '../../../hooks/useFindPw';
import toast from 'react-hot-toast';

const FindPwForm = () => {
  const navigate = useNavigate();

  // 입력값 상태
  const [id, setId] = useState(''); // 이메일(아이디)
  const [code, setCode] = useState(''); // 인증번호
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  // 훅 사용
  const { send, loading: isSending, done: emailSent } = useSendRecoveryEmail();
  const { verify, loading: isVerifying, verified } = useVerifyRecoveryCode();
  const { reset, loading: isChanging } = useResetPassword();

  // 파생 상태
  const pwValid = useMemo(() => password.length >= 8, [password]);
  const pwMatch = useMemo(() => password && password === passwordCheck, [password, passwordCheck]);

  // 인증 메일 발송
  const handleSendCode = async () => {
    if (!id || isSending) return;
    try {
      await send(id);
      toast.success('인증 메일이 발송되었습니다.');
    } catch {
      toast.error('인증 메일 발송 실패');
    }
  };

  // 인증번호 검증
  const handleVerifyCode = async () => {
    if (!id || !code.trim() || isVerifying) return;
    try {
      await verify(id, code.trim());
      toast.success('인증이 완료되었습니다.');
    } catch {
      toast.error('인증번호가 올바르지 않습니다.');
    }
  };

  // 비밀번호 재설정
  const handleChangePassword = async () => {
    if (!pwValid || !pwMatch || isChanging) return;
    try {
      await reset(id, password);
      toast.success('비밀번호가 변경되었습니다.');
      navigate('/login', { replace: true });
    } catch {
      toast.error('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <form
      className='flex h-auto flex-col w-full md:w-[90%] md:py-12 items-start justify-start'
      onSubmit={(e) => e.preventDefault()}
    >
      <div className='md:p-12 rounded-2xl flex flex-col  w-full'>
        {/* 이메일 입력 */}
        <div>
          <InputField
            label='이메일'
            type='text'
            autoComplete='email'
            placeholder='이메일을 입력하세요'
            value={id}
            onChange={(e) => setId(e.target.value)}
            rightElement={
              <div className='hidden md:flex items-center gap-3'>
                <p className='font-light ml-2'>@mju.ac.kr</p>
                <Button
                  type='button'
                  shape='rounded'
                  size='sm'
                  disabled={isSending || !id || emailSent}
                  onClick={handleSendCode}
                  variant={emailSent || isSending ? 'grey' : 'main'}
                  className='w-28 h-10 md:w-34 md:h-12'
                >
                  {emailSent ? '전송 완료' : isSending ? '전송 중...' : '인증 요청'}
                </Button>
              </div>
            }
          />

          {/* 모바일 버튼 */}
          <div className='w-full mt-3 flex items-center justify-between md:hidden'>
            <p className='font-light text-sm mr-2'>@mju.ac.kr</p>
            <Button
              type='button'
              shape='rounded'
              size='sm'
              disabled={isSending || !id || emailSent}
              onClick={handleSendCode}
              variant={emailSent || isSending ? 'grey' : 'main'}
              className='w-28 h-10'
            >
              {emailSent ? '전송 완료' : isSending ? '전송 중...' : '인증 요청'}
            </Button>
          </div>

          <p className='block text-xs font-normal text-grey-40 mt-3 ml-1'>
            @mju.ac.kr 형식의 이메일만 지원
          </p>
        </div>

        {/* 인증코드 입력 */}
        {emailSent && !verified && (
          <div className='flex items-center gap-4 mt-4'>
            <InputField
              label=''
              type='text'
              placeholder='인증번호 입력'
              value={code}
              onChange={(e) => setCode(e.target.value.trim())}
              showHr={false}
            />
            <Button
              type='button'
              variant='main'
              disabled={isVerifying || verified || !code.trim()}
              onClick={handleVerifyCode}
              size='sm'
              shape='rounded'
              className='mt-4 md:mt-0 w-28 h-10 md:w-34 md:h-12'
            >
              {isVerifying ? '확인 중...' : '인증'}
            </Button>
          </div>
        )}

        {/* 새 비밀번호 입력 */}
        {verified && (
          <div className='flex flex-col gap-8 my-4'>
            <InputField
              label='새 비밀번호'
              type='password'
              placeholder='8자 이상 입력'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!password && !pwValid}
              helperText={!pwValid && password ? '비밀번호는 8자 이상이어야 합니다.' : undefined}
            />

            <InputField
              label='새 비밀번호 확인'
              type='password'
              placeholder='비밀번호를 다시 입력하세요'
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
              error={!!passwordCheck && !pwMatch}
              helperText={!pwMatch && passwordCheck ? '비밀번호가 일치하지 않습니다.' : undefined}
            />

            <div className='flex justify-end'>
              <Button
                type='button'
                variant='main'
                disabled={!pwValid || !pwMatch || isChanging}
                onClick={handleChangePassword}
                fullWidth
                size='lg'
                shape='rounded'
              >
                {isChanging ? '변경 중...' : '비밀번호 변경'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default FindPwForm;
