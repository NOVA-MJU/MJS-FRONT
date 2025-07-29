/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import InputField from '../../molecules/common/InputField';
import GenderSelector from '../../molecules/user/GenderSelector';
import Button from '../../atoms/Button/Button';
import DropdownField from '../../molecules/user/DropdownField';
import {
  registerMember,
  checkEmailValidation,
  emailVerification,
  verifyEmailCode,
  checkNicknameValidation,
  checkStuCodeValidation,
} from '../../../api/user';
import { useNavigate } from 'react-router-dom';
import ProfileImageUploader from '../../molecules/user/ProfileUploader.tsx';
import { DEPARTMENT_OPTIONS } from '../../../constants/departments.ts';
import { uploadProfileImage } from '../../../api/user';
import { genderOptions } from '../../../constants/gender.ts';

const RegisterForm: React.FC = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [department, setDepartment] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [gender, setGender] = useState<string>('');

  const navigator = useNavigate();

  /* 유효성 검사 로직 */
  const isPwValid = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\\[\]:;<>,.?~\\/-]).{8,16}$/.test(
    pw,
  );
  const isPwMatch = pw === confirmPw;
  const confirmError = confirmPw !== '' && !isPwMatch;
  const isStudentCodeValid = /^60\d{6}$/.test(studentCode.trim());

  const formValid =
    isPwValid &&
    isPwMatch &&
    nickname.trim() &&
    name.trim() &&
    department.trim() &&
    isStudentCodeValid &&
    gender;

  /*  이메일 인증 상태  */
  const [isSending, setIsSending] = useState(false); // 메일 전송 중 로딩
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState(''); // 사용자가 입력한 인증번호
  const [isVerifying, setIsVerifying] = useState(false); // 인증번호 검증 로딩
  const [emailVerified, setEmailVerified] = useState(false);

  /*  중복 검증 상태  */
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isStuCodeChecked, setIsStuCodeChecked] = useState(false);

  /* 중복 확인(메일 발송) 버튼 */
  const handleSendCode = async () => {
    try {
      const fullEmail = id + '@mju.ac.kr';
      await checkEmailValidation(fullEmail);
      setIsEmailChecked(true);
      setIsSending(true);
      await emailVerification(fullEmail);
      alert('인증 메일을 발송했습니다. 메일함을 확인하세요!');
      setShowCodeInput(true);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || '이메일 중복 확인 또는 인증 메일 발송 실패');
    } finally {
      setIsSending(false);
    }
  };

  /* 인증번호 검증 */
  const handleVerifyCode = async () => {
    try {
      const fullEmail = id + '@mju.ac.kr';
      setIsVerifying(true);
      const ok = await verifyEmailCode(fullEmail, code.trim());
      if (ok) {
        setEmailVerified(true);
        alert('이메일 인증이 완료되었습니다.');
      } else {
        alert('인증에 실패했습니다. 인증번호를 다시 확인하세요.');
      }
    } catch (err: any) {
      alert(err?.message || '인증 요청 실패');
    } finally {
      setIsVerifying(false);
    }
  };

  /* 닉네임 중복 검증 */
  const handleVerifyNickname = async () => {
    try {
      setIsSending(true);
      const res = await checkNicknameValidation(nickname);
      setIsNicknameChecked(true);
      alert(res.data);
      setShowCodeInput(true);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || '이메일 중복 확인 또는 인증 메일 발송 실패');
    } finally {
      setIsSending(false);
    }
  };

  /* 학번 중복 검증 */
  const handleVerifyStudentCode = async () => {
    try {
      setIsSending(true);
      const res = await checkStuCodeValidation(studentCode.trim());
      setIsStuCodeChecked(true);
      alert(res.data);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || '학번 중복 확인 또는 인증 메일 발송 실패');
    } finally {
      setIsSending(false);
    }
  };

  /* 회원가입 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault();
    if (!formValid) return;
    try {
      const uploadedUrl = profileImageFile ? await uploadProfileImage(profileImageFile) : null;
      const fullEmail = id + '@mju.ac.kr';
      const req = {
        name: name,
        email: fullEmail,
        password: pw,
        gender: gender,
        nickname: nickname,
        departmentName: department,
        studentNumber: Number(studentCode),
        profileImageUrl: uploadedUrl,
      };
      await registerMember(req);
      alert('회원가입이 완료되었습니다!');
      navigator('/login');
    } catch (err: any) {
      console.error('회원가입 실패', err);
    }
  };

  return (
    <form className='flex flex-col gap-12 w-[672px] mt-6' onSubmit={handleSubmit}>
      <section>
        <p className='text-3xl font-bold mb-6'>필수 정보</p>
        <div className='flex flex-col bg-white min-h-[540px] p-6 rounded-xl gap-12'>
          <div className='flex flex-col mx-auto gap-12 w-[440px] my-6'>
            <div className='min-h-[110px]'>
              <div className='flex flex-col'>
                <div className='flex justify-center'>
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
                      <div className='flex items-center gap-6'>
                        <p className='font-light'>@mju.ac.kr</p>
                        <Button
                          type='button'
                          shape='rounded'
                          disabled={isSending || emailVerified || isEmailChecked}
                          onClick={handleSendCode}
                          fullWidth={false}
                          variant={emailVerified ? 'grey' : isSending ? 'grey' : 'main'}
                          className='w-34 h-12 p-2'
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
                </div>

                {/* 인증번호 입력칸 */}
                {showCodeInput && (
                  <div className='flex items-center gap-4 mt-4'>
                    <InputField
                      label=''
                      type='text'
                      placeholder='인증번호 입력'
                      value={code}
                      onChange={(e) => setCode(e.target.value.trim())}
                      showHr={false} // 또는 showHr={false} - 사용하는 InputField prop 명에 따라
                    />
                    <Button
                      type='button'
                      variant='main'
                      disabled={isVerifying || emailVerified || !code.trim()}
                      onClick={handleVerifyCode}
                      fullWidth={false}
                      size='sm'
                      shape='rounded'
                      className='w-34 h-12 p-2 mt-2'
                    >
                      {emailVerified ? '완료' : isVerifying ? '확인 중...' : '인증'}
                    </Button>
                  </div>
                )}
              </div>

              <div className='flex flex-col ml-1 mt-2'>
                <p className='text-xs font-normal text-grey-40'>@mju.ac.kr 형식의 이메일만 지원</p>
              </div>
            </div>
            <div>
              <InputField
                label='비밀번호'
                type='password'
                autoComplete='new-password'
                placeholder='비밀번호를 입력하세요'
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
              <div className='flex flex-col ml-1 mt-2'>
                <p className='text-xs font-normal text-grey-40'>8~16자의 영문 대소문자</p>
                <p className='text-xs font-normal text-grey-40'>숫자 1개 이상 포함</p>
                <p className='text-xs font-normal text-grey-40'>특수문자 1개 이상 포함</p>
              </div>
            </div>
            <InputField
              label='비밀번호'
              type='password'
              autoComplete='new-password'
              placeholder='비밀번호를 다시 입력하세요'
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              error={confirmError}
              helperText={confirmError ? '입력한 비밀번호와 일치하지 않습니다.' : ''}
            />
          </div>
        </div>
      </section>
      <section>
        <p className='text-3xl font-bold mb-6'>개인 정보</p>
        <div className='flex flex-col bg-white h-[auto] p-6 rounded-xl gap-12'>
          <div className='flex flex-col mx-auto gap-12 w-[440px] my-6'>
            <ProfileImageUploader onChange={(file) => setProfileImageFile(file)} />
            <InputField
              label='이름'
              type='text'
              placeholder='홍길동(실명)'
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText={'실명을 입력하지 않을 경우 추후 불이익이 발생할 수 있습니다.'}
            />
            <InputField
              label='닉네임'
              type='text'
              placeholder='닉네임'
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setIsNicknameChecked(false);
              }}
              rightElement={
                <Button
                  type='button'
                  shape='rounded'
                  disabled={isSending || nickname === '' || isNicknameChecked}
                  onClick={handleVerifyNickname}
                  fullWidth={false}
                  variant={
                    isNicknameChecked
                      ? 'greyLight'
                      : isSending
                        ? 'greyLight'
                        : nickname
                          ? 'main'
                          : 'greyLight'
                  }
                  className='w-34 h-12 p-2'
                >
                  {isNicknameChecked ? '확인 완료' : isSending ? '확인 중...' : '중복 확인'}
                </Button>
              }
            />
            <DropdownField
              label='학과'
              selected={department}
              onSelect={setDepartment}
              options={DEPARTMENT_OPTIONS}
            />
            <div className='h-[110px]'>
              <InputField
                label='학번'
                type='text'
                placeholder='ex.60000000'
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                error={studentCode !== '' && !isStudentCodeValid}
                helperText={
                  studentCode && !isStudentCodeValid ? '학번 형식이 올바르지 않습니다.' : ''
                }
                rightElement={
                  <Button
                    type='button'
                    shape='rounded'
                    disabled={isSending || !isStudentCodeValid || isStuCodeChecked}
                    onClick={handleVerifyStudentCode}
                    fullWidth={false}
                    variant={
                      !studentCode
                        ? 'greyLight'
                        : isSending
                          ? 'greyLight'
                          : isStuCodeChecked
                            ? 'greyLight'
                            : 'main'
                    }
                    className='w-34 h-12 p-2'
                  >
                    {!studentCode
                      ? '중복 확인'
                      : isSending
                        ? '확인 중...'
                        : isStuCodeChecked
                          ? '확인 완료'
                          : '중복 확인'}
                  </Button>
                }
              />
            </div>
            <GenderSelector
              label='성별'
              options={genderOptions}
              selected={gender}
              onSelect={setGender}
            />
          </div>
        </div>
      </section>

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
