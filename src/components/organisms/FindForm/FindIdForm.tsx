import { useState } from 'react';
import InputField from '../../molecules/common/InputField';
import Button from '../../atoms/Button/Button';
import UserFormButtons from '../../molecules/user/UserFormButtons';
import { useNavigate } from 'react-router-dom';

const FindIdForm = () => {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const isMjuEmail = (email: string) => /@mju\.ac\.kr$/i.test(email);

  const handleSendCode = async () => {
    if (!isMjuEmail(id)) return;
    setIsSending(true);
    try {
      setShowCodeInput(true);
      setIsEmailChecked(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) return;
    setIsVerifying(true);
    try {
      const ok = true;
      if (ok) setEmailVerified(true);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form
      className='flex flex-col w-[90%] px-6 py-12 justify-center items-center'
      onSubmit={(e) => e.preventDefault()}
    >
      <div className='bg-white p-12 rounded-2xl flex flex-col mx-auto gap-12 w-[300px] md:w-full'>
        <div>
          <InputField
            label='이메일'
            type='text'
            autoComplete='email'
            placeholder='이메일을 입력하세요'
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setIsEmailChecked(false);
            }}
            error={!!id && !isMjuEmail(id)}
            rightElement={
              <div className='flex items-center gap-3'>
                <p className='font-light ml-2'>@mju.ac.kr</p>
                <Button
                  type='button'
                  shape='rounded'
                  size='sm'
                  disabled={isSending || emailVerified || isEmailChecked || !isMjuEmail(id)}
                  onClick={handleSendCode}
                  fullWidth={false}
                  variant={emailVerified || isSending ? 'grey' : 'main'}
                  className='w-24 h-10 md:w-34 md:h-12'
                >
                  {emailVerified
                    ? '완료'
                    : isSending
                      ? '전송 중...'
                      : isEmailChecked
                        ? '전송 완료'
                        : '인증 요청'}
                </Button>
              </div>
            }
          />
          <p className='hidden md:block text-xs font-normal text-grey-40 mt-2 ml-1'>
            @mju.ac.kr 형식의 이메일만 지원
          </p>
        </div>

        {showCodeInput && (
          <InputField
            label='인증번호 입력'
            type='text'
            placeholder='인증번호'
            value={code}
            onChange={(e) => setCode(e.target.value.trim())}
            showHr={true}
            rightElement={
              <div className='flex items-center gap-3'>
                <Button
                  type='button'
                  variant='main'
                  disabled={isVerifying || emailVerified || !code.trim()}
                  onClick={handleVerifyCode}
                  fullWidth={false}
                  size='sm'
                  shape='rounded'
                  className='w-28 h-10 md:w-34 md:h-12'
                >
                  {emailVerified ? '완료' : isVerifying ? '확인 중...' : '인증'}
                </Button>
              </div>
            }
          />
        )}
      </div>
      <UserFormButtons
        label='확인'
        loading={false}
        onSignUp={() => navigate('/register')}
        disabled={false}
      />
    </form>
  );
};

export default FindIdForm;
