import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';

import axios from 'axios';
import { login, saveUserInfo } from '../../../api/user';
import { useLoginTracking } from '../../../hooks/gtm/useLoginTracking';

import { AiOutlineInfoCircle } from 'react-icons/ai';
import InputField from '../../molecules/common/InputField';
import UserFormButtons from '../../molecules/user/UserFormButtons';

const emailRegex = /^[\w.-]+@mju\.ac\.kr$/;

/**
 * 로그인 폼 컴포넌트
 * @component
 *
 * @returns {JSX.Element} 로그인 입력 폼 UI
 *
 * @description
 * - 이메일(@mju.ac.kr 형식)과 비밀번호 입력 필드 제공
 * - 입력값 검증: 아이디/비밀번호 미입력, 이메일 형식 오류 처리
 * - `Enter` 키 또는 버튼 클릭 시 `onSubmit` 콜백 호출
 * - 로그인 실패(401 Unauthorized) 시 에러 메시지 표시
 *
 * @remarks
 * 상태 관리:
 * - `id`: 입력된 이메일 값
 * - `pw`: 입력된 비밀번호 값
 * - `emailError`: 이메일 형식 오류 여부
 * - `formError`: 인풋과 버튼 사이에 표시되는 에러 메시지 문자열
 */
const LoginForm = () => {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  // 필드별 & 공통 에러 상태
  const [emailError, setEmailError] = useState(false);
  const [formError, setFormError] = useState('');

  const clearErrors = () => {
    setEmailError(false);
    setFormError('');
  };

  /** GTM hook **/
  const { markStart, onSubmitCapture, markSuccess } = useLoginTracking({
    method: 'email',
  });

  /** id 포커싱 ref **/
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
      useAuthStore.getState().login(userInfo);
      markSuccess();
      navigate('/');
    } catch (err) {
      /**  401 처리 (아이디/비번 불일치) **/
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
