/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import LoadingComponent from './util/LoadingComponent';
import Avatar from './Avatar';
import { getUserInfo } from '@api/userApi';

const ProfileComponent = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogoutClick = async () => {
    await logout();
    window.location.reload();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn) {
        try {
          const response = await getUserInfo();
          setUserInfo(response.data);
        } catch (e) {
          console.error('서버 통신 오류:', e);
          await logout();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [isLoggedIn]);

  //독립적인 렌더컴포넌트의 위치 스타일이 구린 이슈
  if (isLoading) {
    return (
      <div style={{ marginLeft: '300px' }}>
        <LoadingComponent message="프로필 정보 로딩중입니다."></LoadingComponent>
      </div>
    );
  } else {
    if (isError) {
      return (
        <div css={profileContainerStyle}>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            `}
          >
            <span
              css={css`
                font-size: 2rem;
              `}
            >
              오류가 발생했습니다
            </span>
          </div>
        </div>
      );
    }

    return (
      <>
        {isLoggedIn ? (
          <div css={profileContainerStyle}>
            <div css={profileTopSectionStyle}>
              {/* 프로필 이미지 & 유저 정보 */}
              <div css={profileInfoStyle}>
                <Avatar size={50} onClick={handleProfileClick} />
                <div css={userDetailsStyle}>
                  <span css={userNameStyle}>{userInfo?.nickname}</span>
                  <span css={userEmailStyle}>{userInfo?.email}</span>
                </div>
              </div>
              {/* 오른쪽 외부 링크 아이콘 */}

              <FaExternalLinkAlt css={iconStyle} onClick={handleLogoutClick} />
            </div>

            {/* 구분선 */}
            <div css={dividerStyle}></div>

            {/* 네비게이션 메뉴 */}
            <div css={navigationStyle}>
              <a
                href="https://msi.mju.ac.kr"
                target="_blank"
                rel="noopener noreferrer"
                css={css`
                  text-decoration: none;
                  color: inherit;
                `}
              >
                <span
                  css={css`
                    color: #012968;
                  `}
                >
                  MSI
                </span>
              </a>
              <a
                href="https://myicap.mju.ac.kr"
                target="_blank"
                rel="noopener noreferrer"
                css={css`
                  text-decoration: none;
                  color: inherit;
                `}
              >
                <span
                  css={css`
                    color: #0386d0;
                  `}
                >
                  MY
                </span>
                <span
                  css={css`
                    color: #7e8080;
                  `}
                >
                  i
                </span>
                <span
                  css={css`
                    color: #002968;
                  `}
                >
                  Cap
                </span>
              </a>
              <a
                href="https://mcloud.mju.ac.kr"
                target="_blank"
                rel="noopener noreferrer"
                css={css`
                  text-decoration: none;
                  color: inherit;
                `}
              >
                <span
                  css={css`
                    color: #17171b;
                  `}
                >
                  Office
                </span>
                <span
                  css={css`
                    color: #ef6700;
                  `}
                >
                  365
                </span>
              </a>
              <Link
                to={'/profile'}
                css={css`
                  text-decoration: none;
                  color: inherit;
                `}
              >
                <span
                  css={css`
                    color: #17171b;
                  `}
                >
                  MyPage
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div css={profileContainerStyle}>
            <div css={profileLoginSectionStyle}>
              <div css={loginMessageStyle}>
                커뮤니티 이용을 위한
                <span style={{ color: ' navy', fontWeight: 'bold' }}>
                  {' '}
                  로그인{' '}
                </span>
                이 필요합니다!
              </div>
              <button css={loginButtonStyle} onClick={handleLoginClick}>
                {' '}
                로그인
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
};

// 방금 이렇게 local storage에 uuid (사용자 파라미터) 로그인 상태 를 각 로컬 스토리지, 세션 스트로지에 저장하여 리렌더링 시의 상태를 유지하는 과정, 그 상태를 통해 useEffect로 fetching을 하고난 후, Ux 증진을 위해
export default ProfileComponent;

const profileContainerStyle = css`
  display: flex;
  flex-direction: column;
  width: 700px;
  border-radius: 12px;
  margin-left: 100px;
  padding: 15px;
  background-color: white;
  font-family: 'Poppins', 'Arial', sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const profileTopSectionStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const profileLoginSectionStyle = css`
  ${profileTopSectionStyle}; /* ✅ 기존 스타일을 상속 */
  flex-direction: column;
`;

const profileInfoStyle = css`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const userDetailsStyle = css`
  display: flex;
  flex-direction: column;
`;

const userNameStyle = css`
  font-size: 1rem;
  font-weight: bold;
  color: #000;
`;

const userEmailStyle = css`
  font-size: 0.8rem;
  color: #777;
`;

const iconStyle = css`
  font-size: 1rem;
  color: #555;
  cursor: pointer;
`;

const dividerStyle = css`
  width: 100%;
  height: 1px;
  background-color: #ddd;
  margin: 10px 0;
`;

const navigationStyle = css`
  display: flex;
  justify-content: space-around;
  font-size: 0.9rem;
  font-weight: bold;
`;

const loginMessageStyle = css`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
`;

const loginButtonStyle = css`
  background-color: #001f5c;
  color: white;
  width: 100px;
  height: 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: scale(1.1);
    background-color: darkblue;
  }

  &:active {
    transform: scale(0.95);
  }
`;
