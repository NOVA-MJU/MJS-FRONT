import React from 'react';
import EmailFieldWithVerification from '../../molecules/user/EmailFieldWithVerification';
import PasswordField from '../../molecules/user/PasswordField';
import ConfirmPasswordField from '../../molecules/user/ConfirmPasswordField';

interface Props {
  id: string;
  setId: (val: string) => void;
  pw: string;
  setPw: (val: string) => void;
  confirmPw: string;
  setConfirmPw: (val: string) => void;
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
  confirmError: boolean;
}

const RequiredInfoSection = (props: Props) => {
  return (
    <section>
      <p className='text-xl md:text-3xl font-bold mb-6 text-mju-primary'>필수 정보</p>
      <div className='flex flex-col bg-white min-h-[540px] p-6 rounded-xl gap-12'>
        <div className='flex flex-col md:mx-auto gap-6 md:gap-12 my-6'>
          <EmailFieldWithVerification {...props} />
          <PasswordField pw={props.pw} setPw={props.setPw} />
          <ConfirmPasswordField
            confirmPw={props.confirmPw}
            setConfirmPw={props.setConfirmPw}
            confirmError={props.confirmError}
          />
        </div>
      </div>
    </section>
  );
};

export default RequiredInfoSection;
