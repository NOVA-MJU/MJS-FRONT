import React, { useState } from 'react';
import InputField from '../../molecules/common/InputField';
import LoginButtons from '../../molecules/user/LoginButtons';
import { useNavigate } from 'react-router-dom';

const emailRegex = /^[\w.-]+@mju\.ac\.kr$/;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [emailError, setEmailError] = useState(false);

  const formValid = emailRegex.test(id) && pw.trim() !== '';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 1) 이메일 형식 체크
    if (!emailRegex.test(id)) {
      alert('@mju.ac.kr 이메일만 로그인할 수 있습니다.');
      setEmailError(true);
      return;
    }

    // 2) 공백 체크
    if (id.trim() === '' || pw.trim() === '') {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 3) formValid가 false라면 방어적으로 종료
    if (!formValid) return;

    console.log('로그인 요청: ', { id, pw });
  };

  return (
    <form className='flex flex-col mx-auto gap-12 w-[440px]' onSubmit={handleLogin}>
      <InputField
        label='이메일'
        type='email'
        placeholder='@mju.ac.kr'
        value={id}
        onChange={(e) => {
          setId(e.target.value);
          setEmailError(false);
        }}
        error={emailError}
        helperText={emailError ? '학교 이메일 형식이 아닙니다.' : ''}
      />
      <InputField
        label='비밀번호'
        type='password'
        placeholder='비밀번호를 입력하세요'
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />
      <form onSubmit={handleLogin} className='flex flex-col gap-y-6'>
        <LoginButtons
          loading={false}
          onSignUp={() => navigate('/register')}
          disabled={!formValid}
        />
      </form>
    </form>
  );
};

export default LoginForm;
