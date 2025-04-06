/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../IMG/schoolLogo.png'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  return (
    <nav css={navbarStyle}>
      <div css={navbarContainer}>
        <div css={css`display: flex; align-items: center; gap: 10px;`}>
          <img
            css={css`width: 40px; height: 40px;`}
            src={logo}
            alt="Logo" />
          <Link to={'/'} style={{ textDecoration: 'none' }}>
            <span css={css`color: white; font-size: 1.5rem; font-weight: bold;`}>
              MJ<span style={{ color: 'skyblue' }}>S</span>
            </span>
          </Link>
        </div>
        <div css={hamburgerMenu} onClick={toggleMenu}>
          ☰
        </div>
        <ul className={`menu ${menuOpen ? 'menu-open' : ''}`}>
          <li>
            <Link to="/info">학과정보</Link>
          </li>
          <li>
            <Link to="/meal">식단</Link>
          </li>
          <li>
            <Link to="/market">벼룩시장</Link>
          </li>
          <li>
            <Link to="/break">제휴</Link>
          </li>
          <li>
            <Link to="/notices">공지사항</Link>
          </li>
          <li>
            <Link to="/board">자유게시판</Link>
          </li>
          <li>
            <Link to="/reviews">취업후기</Link>
          </li>
          <li>
            <a
              href="https://namu.wiki/w/%EB%AA%85%EC%A7%80%EB%8C%80%ED%95%99%EA%B5%90"
              target="_blank"
              rel="noopener noreferrer"
            >
              띵지위키
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

const navbarStyle = css`
  width: 100%;
  background-color: #002f6c;
  padding: 10px;
  top: 0;
  z-index: 1000;

  .menu {
    display: flex;
    list-style: none;
    gap: 20px;

    @media (max-width: 1024px) {
      display: none;
      flex-direction: column;
      align-items: flex-end;
      width: 100%;
      padding: 10px 0;
      background-color: #002f6c;
    }

    li {
      a {
        color: white;
        text-decoration: none;
        font-size: 1rem;
        padding: 8px 16px;
        border-radius: 5px;
        transition: all 0.3s ease-in-out;

        &:hover {
          background-color: #FFFFFF33;
        }
      }
    }
  }

  .menu-open {
    display: flex !important;
  }

  @media (max-width: 1024px) {
    .logo {
      padding-right: 15px; /* 로고와 햄버거 메뉴 사이의 간격을 넓히기 위한 패딩 */
    }
  }
`
const navbarContainer = css`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const hamburgerMenu = css`
  display: none;
  font-size: 1.8rem;
  color: white;
  cursor: pointer;

  @media (max-width: 1024px) {
    display: block;
    margin-left: 20px; /* 햄버거 메뉴와 로고 사이 간격 추가 */
  }
`
