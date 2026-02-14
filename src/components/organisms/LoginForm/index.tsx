import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAuthStore } from '../../../store/useAuthStore';
import { login, saveUserInfo } from '../../../api/user';
import { useLoginTracking } from '../../../hooks/gtm/useLoginTracking';
import { handleErrorWithStatus } from '../../../utils/error';
import { validateMjuEmail } from '../../../utils/validation';

import { AiOutlineInfoCircle } from 'react-icons/ai';
import InputField from '../../molecules/common/InputField';
import UserFormButtons from '../../molecules/user/UserFormButtons';
import { EMAIL_DOMAIN } from '../../../constants/common';

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
    if (!validateMjuEmail(id)) {
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
      const errorMessage =
        axios.isAxiosError(err) && err.response?.status === 401
          ? '입력하신 정보가 일치하지 않습니다. 다시 확인해 주세요.'
          : '로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';

      handleErrorWithStatus(
        err,
        {
          401: '입력하신 정보가 일치하지 않습니다. 다시 확인해 주세요.',
        },
        '로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      );
      setFormError(errorMessage);
    }
  };

  return (
    <form
      className='mx-auto flex w-full flex-col gap-5 md:w-[440px] md:gap-12'
      onSubmit={handleLogin}
      autoComplete='on'
    >
      <InputField
        ref={inputRef}
        label='이메일'
        name='username'
        type='email'
        placeholder={EMAIL_DOMAIN}
        defaultValue={id}
        showHr={false}
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
        showHr={false}
        onChange={(e) => {
          setPw(e.target.value);
          clearErrors();
          markStart();
        }}
        autoComplete='current-password'
      />

      {formError && (
        <div className='text-error -mb-6 flex w-full items-center gap-2 text-xs md:text-sm'>
          <AiOutlineInfoCircle className='text-error' />
          <p>{formError}</p>
        </div>
      )}

      <div className='mt-2 flex flex-col gap-y-6'>
        <UserFormButtons
          label='로그인'
          loading={false}
          onSignUp={() => navigate('/register')}
          disabled={!id.trim() || !pw.trim()}
        />
      </div>
    </form>
  );
};

export default LoginForm;
