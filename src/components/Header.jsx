/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FaBullhorn, FaSearch } from 'react-icons/fa';
import ProfileComponent from './ProfileComponent';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <div css={css`width: 100%; display: flex; gap: 1rem;`}>
      <div css={css`flex: 2; display: flex; flex-direction: column; gap: 1rem;`}>
        <div
          css={css`
            display: flex; 
            align-items: center; 
            gap: 1rem; 
            font-size: 1.1rem; 
            font-weight: 600; 
            color: #0055ff;
          `}
        >
          <FaBullhorn css={css`font-size: 1.4rem;`} />
          <span>현재 Version1 작업중입니다 _ MJS 일동</span>
        </div>
        <div>
          <SearchBar />
        </div>
      </div>
      <div css={css`flex: 1;`}>
        <ProfileComponent />
      </div>
    </div>
  );
};
