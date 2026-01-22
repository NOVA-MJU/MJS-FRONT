import { useMemo } from 'react';
import InputField from '../../common/InputField';

interface Props {
  pw: string;
  setPw: (val: string) => void;
}

const PasswordField = ({ pw, setPw }: Props) => {
  const isValidPassword = useMemo(() => {
    if (!pw) return true;
    if (pw.length < 8 || pw.length > 16) return false;
    if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw)) return false;
    if (!/\d/.test(pw)) return false;
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) return false;

    return true;
  }, [pw]);

  const showError = pw.length > 0 && !isValidPassword;

  return (
    <div>
      <InputField
        label='비밀번호'
        type='password'
        autoComplete='new-password'
        placeholder='비밀번호를 입력하세요'
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        error={showError}
        helperText={showError ? '비밀번호는 아래 조건을 반드시 충족해야 합니다.' : ''}
      />
      <div className='text-grey-40 mt-2 ml-1 flex flex-col text-xs'>
        <p>8~16자의 영문 대소문자</p>
        <p>숫자 1개 이상 포함</p>
        <p>특수문자 1개 이상 포함</p>
      </div>
    </div>
  );
};

export default PasswordField;
