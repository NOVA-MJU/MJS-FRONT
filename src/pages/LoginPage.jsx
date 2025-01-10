/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css, Global, keyframes } from '@emotion/react';
import logoImg from '../IMG/schoolLogoWithNewColor.png'; // 이미지 import

const globalStyle = css`
  body,
  html,
  #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const containerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
  font-family: 'Poppins', 'Arial', sans-serif;
  animation: ${fadeIn} 1s ease-in-out;
`;

const formStyle = css`
  background-color: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const titleContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const logoStyle = css`
  width: 50px;
  height: 50px;
  object-fit: contain;
  background-color: transparent; /* 투명 배경 유지 */
  margin-bottom: 0.5rem;
`;

const titleStyle = css`
  font-size: 1.8rem;
  font-weight: 600;
  color: #001f5c;
  margin: 0; /* 로고와 제목의 간격 최소화 */
`;

const inputStyle = css`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #001f5c;
    box-shadow: 0 0 5px rgba(0, 31, 92, 0.3);
  }
`;

const buttonStyle = css`
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  background-color: #001f5c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #001542;
    transform: translateY(-3px);
  }

  &:active {
    background-color: #000f35;
    transform: translateY(0);
  }
`;

const errorMessageStyle = css`
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const signupTextStyle = css`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #555;

  a {
    color: #001f5c;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
    } else {
      setError('');
      alert('로그인 성공!');
      // 실제 로그인 요청 처리 로직 추가
    }
  };

  return (
    <>
      <Global styles={globalStyle} />
      <div css={containerStyle}>
        <form css={formStyle} onSubmit={handleSubmit}>
          <div css={titleContainerStyle}>
            <img src={logoImg} alt="학교 로고" css={logoStyle} />
            <h2 css={titleStyle}>로그인</h2>
          </div>
          <input
            type="text"
            placeholder="아이디 또는 이메일"
            css={inputStyle}
          />
          <input
            type="password"
            placeholder="비밀번호"
            css={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p css={errorMessageStyle}>{error}</p>}
          <button type="submit" css={buttonStyle}>
            로그인
          </button>
          <p css={signupTextStyle}>
            계정이 없으신가요? <a href="/signup">회원가입하기</a>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
