/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingComponent from '../util/LoadingComponent';
import { getNews } from '../../api/newsApi';

const newsContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  margin-left: 0px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const tabsContainerStyle = css`
  display: flex;
  border-bottom: 2px solid #ddd;
  margin-bottom: 15px;
`;

const tabStyle = (isActive) => css`
  flex: 1;
  text-align: center;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border-bottom: ${isActive ? '3px solid navy' : '3px solid transparent'};
  background: ${isActive ? 'white' : '#f7f7f7'};
  color: ${isActive ? 'navy' : 'gray'};
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #eef1ff;
  }
`;

const newsCardStyle = css`
  width: 100%;
  display: flex;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  text-decoration: none;

  &:hover {
    transform: scale(1.02);
  }
`;

const newsImageStyle = css`
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 20px;
`;

const newsContentStyle = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const newsTitleStyle = css`
  font-size: 1.2rem;
  font-weight: bold;
  color: #001f5c;
  margin: 0;
`;

const newsSummaryStyle = css`
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

const loadMoreButtonStyle = css`
  background: navy;
  color: white;
  font-size: 0.9rem;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin: 20px auto;

  &:hover {
    background: #003366;
  }
`;

const MyongjiNews = () => {
  const [newsData, setNewsData] = useState({ REPORT: [], SOCIETY: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('REPORT');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewsInfo = async (category) => {
      try {
        //EndPoint -> /news?category={}

        const response = await getNews(category);

        setNewsData((prevData) => ({
          ...prevData,

          [category]: response.data.content,
        }));
      } catch (error) {
        console.log('명대신문 데이터 서버 오류', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsInfo('REPORT');
    fetchNewsInfo('SOCIETY');
  }, []);

  if (loading) {
    return <LoadingComponent message="명대신문 컨텐츠를 불러오는 중..." />;
  }

  const displayedNews = (newsData[activeTab] || []).slice(0, 4);

  return (
    <div css={newsContainerStyle}>
      <h2 style={{ color: 'black' }}>명대신문</h2>
      <div css={tabsContainerStyle}>
        <div
          css={tabStyle(activeTab === 'REPORT')}
          onClick={() => setActiveTab('REPORT')}
        >
          보도
        </div>
        <div
          css={tabStyle(activeTab === 'SOCIETY')}
          onClick={() => setActiveTab('SOCIETY')}
        >
          사회
        </div>
      </div>
      {displayedNews.length > 0 ? (
        displayedNews.map((news, index) => (
          <a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
            css={newsCardStyle}
          >
            {news.imageUrl ?
              (
                <img
                  src={news.imageUrl}
                  css={newsImageStyle}
                />
              ) : (
                <></>
              )
            }
            <div css={newsContentStyle}>
              <p css={newsTitleStyle}>
                {news.title}
              </p>
              <p css={newsSummaryStyle}>
                {news.summary}
              </p>
            </div>
          </a>
        ))
      ) : (
        <p>📭 표시할 뉴스가 없습니다.</p>
      )}

      <button css={loadMoreButtonStyle} onClick={() => navigate('/news')}>
        더보기
      </button>
    </div>
  );
};

export default MyongjiNews;
