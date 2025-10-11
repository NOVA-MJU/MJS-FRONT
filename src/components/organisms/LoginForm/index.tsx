import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useAuthStore } from '../../../store/useAuthStore';
import { login, saveUserInfo } from '../../../api/user';
import { useLoginTracking } from '../../../hooks/gtm/useLoginTracking';

import { AiOutlineInfoCircle } from 'react-icons/ai';
import InputField from '../../molecules/common/InputField';
import UserFormButtons from '../../molecules/user/UserFormButtons';

const emailRegex = /^[\w.-]+@mju\.ac\.kr$/;

/**
 * 로그인 폼 컴포넌트
 * - 이메일(@mju.ac.kr 형식)과 비밀번호 입력
 * - 입력값 검증 및 에러 표시
 * - 성공 시: AT는 메모리에 저장됨(서비스 내부), 사용자 정보 fetch 후 Zustand에 저장
 * - 실패 시: 401 → 자격 증명 오류 메시지
 */
const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [id, setId] = useState<string>('');
  const [pw, setPw] = useState<string>('');

  // 필드별 & 공통 에러 상태
  const [emailError, setEmailError] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Zustand 액션(토큰은 저장하지 않음)
  const { setLoggedIn, setUser } = useAuthStore();

  const clearErrors = () => {
    setEmailError(false);
    setFormError('');
  };

  /** GTM hook **/
  const { markStart, onSubmitCapture, markSuccess } = useLoginTracking({
    method: 'email',
  });

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
      // 1) 로그인
      await login(id, pw);

      // 2) 사용자 정보 조회
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
    <form className='flex flex-col mx-auto gap-12 w-[300px] md:w-[440px]' onSubmit={handleLogin}>
      <InputField
        label='이메일'
        type='email'
        placeholder='@mju.ac.kr'
        value={id}
        onChange={(e) => {
          setId(e.target.value);
          clearErrors();
          markStart();
        }}
        error={emailError}
        helperText=''
      />

      <InputField
        label='비밀번호'
        type='password'
        placeholder='비밀번호를 입력하세요'
        value={pw}
        onChange={(e) => {
          setPw(e.target.value);
          clearErrors();
          markStart();
        }}
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
