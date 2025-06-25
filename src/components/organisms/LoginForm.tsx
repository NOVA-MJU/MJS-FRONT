import React, { useState } from 'react';
import InputBox from '../molecules/InputField';
import ButtonGroup from '../molecules/ButtonGroup';

const LoginForm: React.FC = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[\w.-]+@mju\.ac\.kr$/;
    const isValidEmail = emailRegex.test(id);

    if (!isValidEmail) {
      alert('@mju.ac.kr 이메일만 로그인할 수 있습니다.');
      return;
    }
    if (id.trim() === '' || pw.trim() === '') {
      alert('아이디와 패스워드를 모두 입력해주세요.');
      return;
    }

    console.log('로그인 요청: ', { id, pw }); // 실제 로그인 API 연결 예정
  };

  return (
    <div className='flex items-center bg-white p-6 rounded-xl'>
      <form
        className='flex flex-col w-[440px] mx-auto items-center gap-y-12 gap-x-6 my-12'
        onSubmit={handleLogin}
      >
        <InputBox
          label='이메일'
          type='email'
          placeholder='@mju.ac.kr'
          onChange={(e) => setId(e.target.value)}
        />
        <InputBox
          label='비밀번호'
          type='password'
          placeholder='비밀번호를 입력하세요'
          onChange={(e) => setPw(e.target.value)}
        />
        <ButtonGroup />
      </form>
    </div>
  );
};

export default LoginForm;
