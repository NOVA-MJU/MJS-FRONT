import { useState } from 'react';

import { genderOptions } from '../../../constants/gender';
import { useRegisterHandlers } from '../../../hooks/useRegister';
import { validatePassword, validateStudentCode } from '../../../utils/validation';
import PersonalInfoSection from './PersonalInfoSection';
import RequiredInfoSection from './RequiredInfoSection';
import Button from '../../atoms/Button/Button';

const RegisterForm = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [department, setDepartment] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [gender, setGender] = useState<string>(genderOptions[0]?.value);

  const {
    code,
    setCode,
    isSending,
    showCodeInput,
    isVerifying,
    emailVerified,
    isEmailChecked,
    isNicknameChecked,
    isStuCodeChecked,
    setIsEmailChecked,
    setIsNicknameChecked,
    handleSendCode,
    handleVerifyCode,
    handleVerifyNickname,
    handleVerifyStudentCode,
    handleSubmit,
  } = useRegisterHandlers({
    id,
    nickname,
    studentCode,
    profileImageFile,
    pw,
    name,
    gender,
    department,
  });
  const isPwValid = validatePassword(pw);
  const isPwMatch = pw === confirmPw;
  const confirmError = confirmPw !== '' && !isPwMatch;
  const isStudentCodeValid = validateStudentCode(studentCode);

  const formValid =
    isPwValid &&
    isPwMatch &&
    nickname.trim() &&
    name.trim() &&
    department.trim() &&
    isStudentCodeValid &&
    gender;

  return (
    <form
      className='flex flex-col gap-6 md:gap-12 w-full md:w-[672px] mt-6'
      onSubmit={handleSubmit}
    >
      <RequiredInfoSection
        id={id}
        setId={setId}
        pw={pw}
        setPw={setPw}
        confirmPw={confirmPw}
        setConfirmPw={setConfirmPw}
        code={code}
        setCode={setCode}
        isSending={isSending}
        showCodeInput={showCodeInput}
        isVerifying={isVerifying}
        emailVerified={emailVerified}
        isEmailChecked={isEmailChecked}
        setIsEmailChecked={setIsEmailChecked}
        handleSendCode={handleSendCode}
        handleVerifyCode={handleVerifyCode}
        confirmError={confirmError}
      />
      <PersonalInfoSection
        profileImageFile={profileImageFile}
        setProfileImageFile={setProfileImageFile}
        name={name}
        setName={setName}
        nickname={nickname}
        setNickname={setNickname}
        department={department}
        setDepartment={setDepartment}
        studentCode={studentCode}
        setStudentCode={setStudentCode}
        gender={gender}
        setGender={setGender}
        isSending={isSending}
        isNicknameChecked={isNicknameChecked}
        isStuCodeChecked={isStuCodeChecked}
        isStudentCodeValid={isStudentCodeValid}
        handleVerifyNickname={handleVerifyNickname}
        handleVerifyStudentCode={handleVerifyStudentCode}
        setIsNicknameChecked={setIsNicknameChecked}
      />
      <Button
        type='submit'
        variant={formValid ? 'main' : 'greyLight'}
        disabled={!formValid}
        fullWidth
        size='lg'
        shape='rounded'
      >
        MJS 시작하기
      </Button>
    </form>
  );
};

export default RegisterForm;
