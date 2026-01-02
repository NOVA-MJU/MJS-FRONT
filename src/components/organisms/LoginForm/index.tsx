import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAuthStore } from '../../../store/useAuthStore';
import { login, saveUserInfo } from '../../../api/user';
import { useLoginTracking } from '../../../hooks/gtm/useLoginTracking';

import { AiOutlineInfoCircle } from 'react-icons/ai';
import InputField from '../../molecules/common/InputField';
import UserFormButtons from '../../molecules/user/UserFormButtons';

const emailRegex = /^[\w.-]+@mju\.ac\.kr$/;

const LoginForm = () => {
  const navigate = useNavigate();

  const [id, setId] = useState<string>('');
  const [pw, setPw] = useState<string>('');

  const [emailError, setEmailError] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  const { setLoggedIn, setUser } = useAuthStore();

  const clearErrors = () => {
    setEmailError(false);
    setFormError('');
  };

  const { markStart, onSubmitCapture, markSuccess } = useLoginTracking({
    method: 'email',
  });

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    onSubmitCapture(e);
    e.preventDefault();

    if (id.trim() === '') {
      setFormError('아이디를 입력해 주세요');
      setEmailError(false);
      return;
    }
    if (pw.trim() === '') {
      setFormError('비밀번호를 입력해 주세요');
      return;
    }
    if (!emailRegex.test(id)) {
      setEmailError(true);
      setFormError('학교 이메일 형식이 아닙니다.');
      return;
    }

    try {
      await login(id, pw);
      const userInfo = await saveUserInfo();
      setUser(userInfo);
      setLoggedIn(true);

      markSuccess();
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setFormError('입력하신 정보가 일치하지 않습니다. 다시 확인해 주세요.');
        return;
      }

      console.error('로그인 또는 회원정보 요청 중 오류 발생:', err);
      setFormError('로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <form
      className='flex flex-col mx-auto gap-12 w-[300px] md:w-[440px]'
      onSubmit={handleLogin}
      autoComplete='on'
    >
      <InputField
        ref={inputRef}
        label='이메일'
        name='username'
        type='email'
        placeholder='@mju.ac.kr'
        defaultValue={id}
        onChange={(e) => {
          setId(e.target.value);
          clearErrors();
          markStart();
        }}
        error={emailError}
        helperText=''
        autoComplete='username'
      />

      <InputField
        label='비밀번호'
        name='password'
        type='password'
        placeholder='비밀번호를 입력하세요'
        value={pw}
        onChange={(e) => {
          setPw(e.target.value);
          clearErrors();
          markStart();
        }}
        autoComplete='current-password'
      />

      {formError && (
        <div className='flex -mt-6 -mb-6 w-full text-xs md:text-sm items-center gap-2 text-error'>
          <AiOutlineInfoCircle className='text-error' />
          <p>{formError}</p>
        </div>
      )}

      <div className='flex flex-col gap-y-6'>
        <UserFormButtons
          label='로그인'
          loading={false}
          onSignUp={() => navigate('/register')}
          disabled={false}
        />
      </div>
    </form>
  );
};

export default LoginForm;
