/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FaSearch } from 'react-icons/fa'

export default function SearchBar() {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        margin-top: 10px;
        background-color: white;
        border-radius: 8px;
        border: 1px solid #ddd;
        padding: 8px 12px;
      `}
    >
      <FaSearch
        css={css`
          margin-right: 10px;
          color: #0055ff;
          font-size: 1.2rem;
        `} />
      <input
        css={css`
          flex: 1;
          padding: 10px;
          border: none;
          outline: none;
          font-size: 1rem;
          color: #333;
        `}
        type="text"
        placeholder="전체 검색창입니다."
        className="search-input" />
      <button
        css={css`
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
        `}
      >
        검색
      </button>
    </div>
  )
}
