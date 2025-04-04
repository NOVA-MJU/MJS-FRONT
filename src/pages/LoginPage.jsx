/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { css, Global, keyframes } from '@emotion/react';
import logoImg from '../IMG/schoolLogoWithNewColor.png'; // 이미지 import
import SignUpPage from './SignupPage';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../components/message/SuccessModal';
import { useAuth } from '../context/AuthContext';
import LoginInput from '@/components/atomic/LoginInput';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccessMessageModalOpen, setIsSuccessMessageModalOpen] =
    useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const openSignUpModal = () => setIsSignUpModalOpen(true);
  const closeSignUpModal = () => setIsSignUpModalOpen(false);

  //onChange 핸들러
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  //authContext에서 구현한 로그인 함수들을 가져옴
  const { login, setIsLoggedIn } = useAuth();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userInfo = {
        email,
        password,
      };

      console.log('📤 로그인 요청 데이터:', userInfo); // 🚀 콘솔에서 확인
      //postLOGIn으로

      await login(userInfo);
      setIsLoggedIn(true);
      setIsSuccessMessageModalOpen(true);
    } catch (e) {
      alert('로그인에 실패했습니다.');
      console.error('❌ 로그인 오류:', e);
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessMessageModalOpen(false);
    navigate('/main');
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
          <LoginInput
            type="text"
            placeholder="이메일을 입력하세요."
            onChange={handleEmailChange}
          />
          <LoginInput
            type="password"
            placeholder="비밀번호를 입력하세요."
            onChange={handlePasswordChange}
          />

          {error && <p css={errorMessageStyle}>{error}</p>}
          <button type="submit" css={buttonStyle}>
            로그인
          </button>
          <p css={signupTextStyle}>
            계정이 없으신가요?{' '}
            <a href="#!" onClick={openSignUpModal}>
              회원가입하기
            </a>
          </p>
        </form>
      </div>
      {/* 모달처럼 보여야 하므로, navigating이 아닌 ChildBlockAppending */}
      {isSignUpModalOpen && (
        <SignUpPage closeSignUpModal={closeSignUpModal}></SignUpPage>
      )}
      {isSuccessMessageModalOpen && (
        <SuccessModal
          message="로그인에 성공했습니다! 메인페이지로 이동합니다."
          //successmodal에서 타임아웃으로 자동으로 닫게 했음요
          onClose={handleSuccessModalClose}
        ></SuccessModal>
      )}
    </>
  );
};

export default LoginPage;

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
