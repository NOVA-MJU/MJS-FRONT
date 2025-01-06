/*eslint-disable */
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { FaBullhorn, FaSearch } from 'react-icons/fa';
import ProfileComponent from './ProfileComponent';

const headerContainerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #ddd;

  .left-section {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-left: 150px;
    margin-top: 70px;
  }

  .highlight-and-search {
    display: flex;
    flex-direction: column;

    .highlight-banner {
      display: flex;
      align-items: center;
      background-color: white;
      padding: 10px;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      color: #0055ff;

      .highlight-icon {
        margin-right: 8px;
        font-size: 1.4rem;
      }
    }

    .search-bar {
      display: flex;
      align-items: center;
      margin-top: 10px;
      background-color: white;
      border-radius: 8px;
      border: 1px solid #ddd;
      padding: 8px 12px;

      .search-icon {
        margin-right: 10px;
        color: #0055ff;
        font-size: 1.2rem;
      }

      .search-input {
        flex: 1;
        padding: 10px;
        border: none;
        outline: none;
        font-size: 1rem;
        color: #333;
      }

      .search-btn {
        padding: 10px 20px;
        background-color: #001f5c;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;

        &:hover {
          background-color: #003cb3;
        }
      }
    }
  }

  .profile-wrapper {
    margin-right: 150px;
    margin-top: 70px;
    flex-shrink: 0;
    width: 25%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;

    .left-section,
    .profile-wrapper {
      width: 100%;
      margin-left: 0;
    }

    .highlight-and-search {
      width: 100%;
      align-items: center;
    }

    .search-bar {
      justify-content: center;
    }
  }
`;

const HeaderComponent = () => {
  return (
    <div css={headerContainerStyle}>
      <div className="left-section">
        <div className="highlight-and-search">
          <div className="highlight-banner">
            <FaBullhorn className="highlight-icon" />
            <span>최원빈 기말고사때 소울푸드 6일 연속감 ㅋㅋ</span>
          </div>

          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="전체 검색창입니다."
              className="search-input"
            />
            <button className="search-btn">검색</button>
          </div>
        </div>
      </div>

      <div className="profile-wrapper">
        <ProfileComponent />
      </div>
    </div>
  );
};

export default HeaderComponent;
