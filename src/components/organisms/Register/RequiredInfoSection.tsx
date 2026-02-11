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
      <p className='mb-6 flex w-fit px-1 text-xl font-bold text-[#000000] md:text-3xl'>
        계정 정보*
      </p>
      <div className='flex min-h-[540px] flex-col gap-12 rounded-xl bg-white p-6'>
        <div className='my-6 flex flex-col gap-6 md:mx-auto md:gap-12'>
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
