/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { getNotice } from '@/api/noticeApi';

const tabContainerStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const tabHeaderStyle = css`
  display: flex;
  justify-content: space-around;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`;

const tabButtonStyle = (isActive) => css`
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: transparent;
  border-bottom: ${isActive ? '3px solid #001f5c' : '3px solid transparent'};
  color: ${isActive ? '#001f5c' : '#555'};
  transition: all 0.3s ease-in-out;

  &:hover {
    color: #001f5c;
  }
`;

const tabContentStyle = css`
  padding: 20px;
  background: #fdfdfd;
  border-radius: 8px;
`;

const noticeCardStyle = css`
  background: #fff;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: translateY(-3px);
    cursor: pointer;
  }
`;

const noticeTitleStyle = css`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #001f5c;
  text-decoration: none;
`;

const noticeInfoStyle = css`
  font-size: 0.9rem;
  color: #777;
`;

const Announcement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [notices, setNotices] = useState([]);

  const tabs = [
    { label: '일반공지', category: 'general' },
    { label: '학사공지', category: 'academic' },
    { label: '장학공지', category: 'scholarship' },
    { label: '진로공지', category: 'career' },
    { label: '학생활동', category: 'activity' },
    { label: '학칙개정', category: 'rule' },
  ];

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getNotice({ category: tabs[activeTab].category });
        setNotices(data);
      } catch (error) {
        console.error('공지사항 실제 Fetching 중 오류 발생', error);
      } finally {
      }
    };
    fetchNotices();
  }, [activeTab]);

  return (
    <div css={tabContainerStyle}>
      <div css={tabHeaderStyle}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            css={tabButtonStyle(activeTab === index)}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div css={tabContentStyle}>
        {notices.length > 0 ? (
          notices.map((notice, idx) => (
            <div key={idx} css={noticeCardStyle}>
              <a
                href={notice.link}
                target="_blank"
                rel="noopener noreferrer"
                css={noticeTitleStyle}
              >
                {notice.title}
              </a>
              <div css={noticeInfoStyle}>
                {notice.date} &bull; {notice.category}
              </div>
            </div>
          ))
        ) : (
          <div>공지사항이 존재하지 않습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Announcement;
