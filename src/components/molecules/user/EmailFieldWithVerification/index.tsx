import InputField from '../../common/InputField';
import Button from '../../../atoms/Button/Button';
import { EMAIL_DOMAIN } from '@/constants/common';

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

const EmailFieldWithVerification = ({
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
}: Props) => (
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
      error={false}
      rightElement={
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-6'>
          <p className='ml-4 font-light md:order-1'>{EMAIL_DOMAIN}</p>

          <Button
            type='button'
            shape='rounded'
            size='sm'
            disabled={isSending || emailVerified || isEmailChecked}
            onClick={handleSendCode}
            fullWidth={false}
            variant={emailVerified ? 'grey' : isSending ? 'grey' : 'main'}
            className='mt-6 h-10 w-24 p-2 md:order-2 md:mt-0 md:h-12 md:w-34'
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
    <p className='text-grey-40 -mt-8 block w-[55%] text-xs font-normal md:hidden'>
      {EMAIL_DOMAIN} 형식의 이메일만 지원
    </p>
    {showCodeInput && (
      <div className='mt-4 flex items-center gap-4'>
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
          className='mt-4 h-10 w-28 md:mt-0 md:h-12 md:w-34'
        >
          {emailVerified ? '완료' : isVerifying ? '확인 중...' : '인증'}
        </Button>
      </div>
    )}
    <p className='text-grey-40 mt-2 ml-1 hidden text-xs font-normal md:block'>
      {EMAIL_DOMAIN} 형식의 이메일만 지원
    </p>
  </div>
);

export default EmailFieldWithVerification;
