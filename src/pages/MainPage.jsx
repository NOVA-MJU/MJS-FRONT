/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useAuth } from '../context/AuthContext';
import Announcement from '@/components/widgets/Announcement';
import MealPlan from '@/components/widgets/MealPlan';
import MyongjiNews from '@/components/widgets/MyoungjiNews';
import MiniBoard from '@/components/widgets/MiniBoard';
import Weather from '@/components/widgets/Weather';
import AdBanner from '@/components/widgets/AdBanner';

const mainPageContainerStyle = css`
  width: 100%;
  background-color: white;
  display: grid;
  grid-template-columns: 2fr 1fr; /* 왼쪽 2/3, 오른쪽 1/3 */
  gap: 20px;
  align-items: start;
  min-height: 100vh;
`;

const leftSectionStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const rightSectionStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const topRowStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const contentBoxStyle = css`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: auto;
`;

const reducedHeightBoxStyle = css`
  ${contentBoxStyle}; //위의 content: boxstyle을 그대로 가져와서 코드를 재활용하는 것;
  height: 200px; /* 배너와 식단 높이 절반으로 줄이기 */
`;

const MainPage = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth(); // 로그인 상태와 상태 변경 함수

  const handleLogout = () => {
    setIsLoggedIn(false); // 로그아웃 시 상태 변경
  };

  return (
    <div css={mainPageContainerStyle}>
      <div css={leftSectionStyle}>
        {/* 상단 배너와 식단 */}
        <div css={topRowStyle}>
          <div css={reducedHeightBoxStyle}>
            <AdBanner />
          </div>
          <div css={reducedHeightBoxStyle}>
            <MealPlan />
          </div>
        </div>

        {/* 학사 공지 탭 */}
        <div css={contentBoxStyle}>
          <h3>공지사항</h3>
          <Announcement />
        </div>

        {/* 명대 뉴스 */}
        <div css={contentBoxStyle}>
          <MyongjiNews />
        </div>
      </div>

      {/* 오른쪽 섹션 */}
      <div css={rightSectionStyle}>
        <div css={contentBoxStyle}>
          <Weather /> {/* 현재 날씨 컴포넌트 */}
        </div>
        <div css={contentBoxStyle}>
          <MiniBoard />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
