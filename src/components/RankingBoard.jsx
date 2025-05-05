/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';

const RankingBoard = () => {
  const [rankList, setRankList] = useState(rankings);

  return (
    <div css={rankingContainerStyle}>
      <div className="ranking-header">실시간 검색 순위</div>
      <ul className="ranking-list">
        {rankList.map((item) => (
          <li key={item.rank}>
            <span className="rank">{item.rank}.</span>
            <span className="search-term">{item.term}</span>
            <span className="trend">{item.trend}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingBoard;

const rankings = [
  { rank: 1, term: '학식', trend: '상승' },
  { rank: 2, term: '명지대 축제', trend: '상승' },
  { rank: 3, term: '오리바', trend: '하락' },
  { rank: 4, term: '스낵코너', trend: '유지' },
  { rank: 5, term: '로또', trend: '상승' },
  { rank: 6, term: '전자사전', trend: '하락' },
  { rank: 7, term: '명지 푸드코트', trend: '유지' },
  { rank: 8, term: '헬프데스크', trend: '상승' },
];

const rankingContainerStyle = css`
  background-color: white; /* 하얀색 배경 */
  color: #001f5c; /* 남색 글자 */
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Noto Sans KR', sans-serif;

  .ranking-header {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 15px;
  }

  .ranking-list {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 1rem;

    li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 5px;

      .rank {
        font-weight: bold;
        margin-right: 10px;
      }

      .search-term {
        flex: 1;
        text-align: left;
      }

      .trend {
        color: #777;
      }
    }
  }
`;
