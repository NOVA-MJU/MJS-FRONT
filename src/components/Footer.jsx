/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import logo from '../IMG/schoolLogoWithNewColor.png';
import { useNavigate } from 'react-router-dom';

// import logo from '../IMG/cuteLogo.webp';

const footerStyle = css`
  width: 100vw;
  background-color: white; /* 배경 색상을 더 진한 회색으로 변경 */
  padding: 15px 0;
  position: relative; /* fixed에서 relative로 변경 */
  bottom: 0;
  left: 0;
`;

const footerContainerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
`;

const footerLogoStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;

  img {
    width: 40px;
    height: 40px;
  }

  .footer-logo-text {
    color: #333; /* 텍스트 색상을 어두운 색으로 유지 */
    font-size: 1.2rem;
    font-weight: 700;
  }
`;

const footerLinksStyle = css`
  ul {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 20px;

    li {
      color: #333; /* 링크 색상 유지 */
      font-size: 0.9rem;
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: #666; /* hover 색상 유지 */
        text-decoration: underline;
      }
    }
  }
`;

const footerCopyrightStyle = css`
  p {
    color: #999; /* 텍스트 색상 유지 */
    font-size: 0.75rem;
    text-align: right;
  }
`;

const Footer = () => {
  const handleContactClick = () => {
    const email = 'mjsearch2025@gmail.com';
    const subject = encodeURIComponent('MJS NOVA 문의드립니다');
    const body = encodeURIComponent(
      '안녕하세요,\n\n문의사항을 아래에 작성해주세요.\n\n- 이름:\n- 연락처:\n- 문의 내용:'
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };
  return (
    <footer css={footerStyle}>
      <div css={footerContainerStyle}>
        <div css={footerLogoStyle}>
          <img src={logo} alt="Logo" />
          <span className="footer-logo-text">
            MJ<span style={{ color: 'skyblue' }}>S</span> NOVA
          </span>
        </div>
        <div css={footerLinksStyle}>
          <ul>
            <li>이용 약관</li>
            <li>개인정보 처리방침</li>
            <li onClick={handleContactClick}>문의하기</li>
          </ul>
        </div>
        <div css={footerCopyrightStyle}>
          <p>© 2025 MJS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
