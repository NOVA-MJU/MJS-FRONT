// components/AdBanner.jsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import adBannerImage from '../../IMG/Myself.jpeg'; // 이미지 파일 import

const adBannerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffe5e5;
  padding: 0; /* 이미지와 간격 없이 꽉 차도록 설정 */
  
  border-radius: 8px;
  overflow: hidden; /* 컨테이너에서 넘치는 이미지 잘라내기 */
  height: 150px; /* 배너 높이 */
  text-align: center;

  img {
    width: 100%; /* 가로로 꽉 채움 */
    height: 100%; /* 세로로 꽉 채움 */
    object-fit: cover; /* 이미지 비율 유지하며 컨테이너에 맞춤 */
  }
`;

const AdBanner = () => {
  return (
    <div css={adBannerStyle}>
      <img src={adBannerImage} alt="광고 배너 이미지" />
    </div>
  );
};

export default AdBanner;
