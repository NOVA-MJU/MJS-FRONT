/** @jsxImportSource @emotion/react */
import { css, Global, keyframes } from '@emotion/react';
import { Link } from 'react-router-dom';

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

// 텍스트 페이드 인 애니메이션
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

// 버튼 호버 시 살짝 흔들리는 애니메이션
const wiggle = keyframes`
  0% { transform: rotate(0); }
  25% { transform: rotate(2deg); }
  50% { transform: rotate(-2deg); }
  75% { transform: rotate(1deg); }
  100% { transform: rotate(0); }
`;

const containerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #fefefe;
  font-family: 'Poppins', 'Arial', sans-serif;
  text-align: center;
`;

const titleStyle = css`
  font-size: 4rem;
  font-weight: 800;
  color: #0077b6;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.8s ease-in-out forwards;
`;

const messageStyle = css`
  font-size: 1.8rem;
  color: #111111;
  margin-bottom: 2rem;
  animation: ${fadeIn} 1.2s ease-in-out forwards;
`;

const buttonStyle = css`
  padding: 1rem 3rem;
  font-size: 1.4rem;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 50px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  animation: ${fadeIn} 1.5s ease-in-out forwards;
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: #d9363e;
    transform: translateY(-3px);
    box-shadow: 0 15px 20px rgba(255, 77, 79, 0.3);
    animation: ${wiggle} 0.5s ease-in-out;
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

function NotFoundPage() {
  return (
    <>
      <Global styles={globalStyle} />
      <div css={containerStyle}>
        <h1 css={titleStyle}>404 : Page Not Found</h1>
        <p css={messageStyle}>
          죄송합니다! 요청하신 페이지를 찾을 수 없습니다.
        </p>
        <Link to="/" css={buttonStyle}>
          Back to Home
        </Link>
      </div>
    </>
  );
}

export default NotFoundPage;
