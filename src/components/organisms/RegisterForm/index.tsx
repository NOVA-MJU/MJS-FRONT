import React, { useState } from 'react';
import InputField from '../../molecules/InputField';
import GenderSelector from '../../molecules/GenderSelector';
import Button from '../../atoms/button/Button';
import DropdownField from '../../molecules/DropdownField';
const RegisterForm: React.FC = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [nickname, setNickname] = useState('');
  const [department, setDepartment] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [gender, setGender] = useState<string>('');
  const genderOptions = ['남자', '여자', '기타'];

  /* 유효성 검사 로직 */
  const isEmailValid = /^[\w.-]+@mju\.ac\.kr$/.test(id.trim());
  const isPwValid = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\\[\]:;<>,.?~\\/-]).{8,16}$/.test(
    pw,
  );
  const isPwMatch = pw === confirmPw;
  const confirmError = confirmPw !== '' && !isPwMatch;
  const isStudentCodeValid = /^60\d{6}$/.test(studentCode.trim());

  const formValid =
    isEmailValid &&
    isPwValid &&
    isPwMatch &&
    nickname.trim() &&
    department.trim() &&
    isStudentCodeValid &&
    gender;

  /* 제출 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    console.log({ id, pw, nickname, department, studentCode, gender });
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-12 w-[672px] mt-6'>
      {/* ===== 필수 정보 ===== */}
      <section>
        <p className='text-3xl font-bold mb-6'>필수 정보</p>
        <div className='flex flex-col bg-white h-[540px] p-6 rounded-xl gap-12'>
          <div className='flex flex-col mx-auto gap-12 w-[440px] my-6'>
            <div className='h-[110px]'>
              <InputField
                label='이메일'
                type='email'
                placeholder='@mju.ac.kr'
                value={id}
                onChange={(e) => setId(e.target.value)}
                error={id !== '' && !isEmailValid}
                helperText={id && !isEmailValid ? '학교 이메일 형식이 아닙니다.' : ''}
              />
            </div>
            <div>
              <InputField
                label='비밀번호'
                type='password'
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
              placeholder='비밀번호를 다시 입력하세요'
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              error={confirmError}
              helperText={confirmError ? '입력한 비밀번호와 일치하지 않습니다.' : ''}
            />
          </div>
        </div>
      </section>

      {/* ===== 개인 정보 ===== */}
      <section>
        <p className='text-3xl font-bold mb-6'>개인 정보</p>
        <div className='flex flex-col bg-white h-[6340px] p-6 rounded-xl gap-12'>
          <div className='flex flex-col mx-auto gap-12 w-[440px] my-6'>
            <InputField
              label='닉네임'
              type='text'
              placeholder='홍길동'
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <DropdownField label='학과' selected={department} onSelect={setDepartment} />
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
              />
            </div>
            <GenderSelector options={genderOptions} selected={gender} onSelect={setGender} />
          </div>
        </div>
      </section>

      {/* ===== 제출 버튼 ===== */}
      <Button
        type='submit'
        variant={formValid ? 'main' : 'greyLight'}
        disabled={!formValid}
        fullWidth
        size='lg'
        shape='rounded'
      >
        계정 만들기
      </Button>
    </form>
  );
};

export default RegisterForm;
