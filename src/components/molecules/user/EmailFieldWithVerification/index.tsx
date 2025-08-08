import React from 'react';
import InputField from '../../common/InputField';
import Button from '../../../atoms/Button/Button';

interface Props {
  id: string;
  setId: (val: string) => void;
  code: string;
  setCode: (val: string) => void;
  isSending: boolean;
  showCodeInput: boolean;
  isVerifying: boolean;
  emailVerified: boolean;
  isEmailChecked: boolean;
  setIsEmailChecked: (val: boolean) => void;
  handleSendCode: () => void;
  handleVerifyCode: () => void;
}

const EmailFieldWithVerification: React.FC<Props> = ({
  id,
  setId,
  code,
  setCode,
  isSending,
  showCodeInput,
  isVerifying,
  emailVerified,
  isEmailChecked,
  setIsEmailChecked,
  handleSendCode,
  handleVerifyCode,
}) => (
  <div className='min-h-[110px]'>
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
      error={id !== ''}
      rightElement={
        <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-6'>
          <p className='font-light md:order-1 ml-4'>@mju.ac.kr</p>

          <Button
            type='button'
            shape='rounded'
            size='sm'
            disabled={isSending || emailVerified || isEmailChecked}
            onClick={handleSendCode}
            fullWidth={false}
            variant={emailVerified ? 'grey' : isSending ? 'grey' : 'main'}
            className='mt-6 md:mt-0 w-24 h-10 md:w-34 md:h-12 p-2 md:order-2'
          >
            {emailVerified
              ? '완료'
              : isSending
                ? '전송 중...'
                : isEmailChecked
                  ? '확인 완료'
                  : '인증 요청'}
          </Button>
        </div>
      }
    />
    <p className='w-[55%] block md:hidden -mt-8 text-xs font-normal text-grey-40'>
      @mju.ac.kr 형식의 이메일만 지원
    </p>
    {showCodeInput && (
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
          disabled={isVerifying || emailVerified || !code.trim()}
          onClick={handleVerifyCode}
          fullWidth={false}
          size='sm'
          shape='rounded'
          className='mt-4 md:mt-0 w-28 h-10 md:w-34 md:h-12'
        >
          {emailVerified ? '완료' : isVerifying ? '확인 중...' : '인증'}
        </Button>
      </div>
    )}
    <p className='hidden md:block text-xs font-normal text-grey-40 mt-2 ml-1'>
      @mju.ac.kr 형식의 이메일만 지원
    </p>
  </div>
);

export default EmailFieldWithVerification;
