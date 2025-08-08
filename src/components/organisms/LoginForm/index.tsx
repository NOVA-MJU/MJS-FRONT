/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import InputField from '../../molecules/common/InputField';
import LoginButtons from '../../molecules/user/LoginButtons';
import { useNavigate } from 'react-router-dom';
import { login, saveUserInfo } from '../../../api/user';
import { useAuthStore } from '../../../store/useAuthStore';

const emailRegex = /^[\w.-]+@mju\.ac\.kr$/;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [emailError, setEmailError] = useState(false);

  const formValid = emailRegex.test(id) && pw.trim() !== '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) {
      console.warn('유효하지 않은 로그인 정보입니다.');
      return;
    }

    try {
      await login(id, pw);
      const userInfo = await saveUserInfo();
      useAuthStore.getState().login(userInfo);
      navigate('/');
    } catch (err: any) {
      console.error('로그인 또는 회원정보 요청 중 오류 발생:', err);
      alert('로그인 또는 회원정보 요청 중 오류 발생');
    }
  };
  return (
    <form className='flex flex-col mx-auto gap-12 w-[300px] md:w-[440px]' onSubmit={handleLogin}>
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
      <div onSubmit={handleLogin} className='flex flex-col gap-y-6'>
        <LoginButtons
          loading={false}
          onSignUp={() => navigate('/register')}
          disabled={!formValid}
        />
      </div>
    </form>
  );
};

export default LoginForm;
