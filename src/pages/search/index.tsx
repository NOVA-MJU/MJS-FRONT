import Divider from '../../components/atoms/Divider';
import SearchBar from '../../components/atoms/SearchBar';
import { Typography } from '../../components/atoms/Typography';
import SearchResultItem from '../../components/molecules/SearchResultItem';
import Chip from '../../components/atoms/Chip';
import { useEffect, useState } from 'react';
import { getSearchOverview, type SearchResultItemRes } from '../../api/search';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [noticeItems, setNoticeItems] = useState<SearchResultItemRes[]>([]);
  const [boardItems, setBoardItems] = useState<SearchResultItemRes[]>([]);
  const [newsItems, setNewsItems] = useState<SearchResultItemRes[]>([]);
  const [initialContent, setInitialContent] = useState('');

  const keyword = searchParams.get('keyword') ?? searchParams.get('search');

  /**
   * 검색어 초기값 반영 (search parameter 반영)
   */
  useEffect(() => {
    (async () => {
      if (!keyword) return;
      setInitialContent(keyword);
      try {
        await handleSearch(keyword);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [keyword]);

  /**
   * 검색 요청 function
   */
  async function handleSearch(text: string) {
    const res = await getSearchOverview(text);
    setNoticeItems(res.notice);
    setBoardItems(res.community);
    setNewsItems(res.news);
  }

  /** 검색바 제출 시: URL 쿼리 갱신 → useEffect 재실행 */
  const handleSubmitFromSearchBar = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSearchParams({ keyword: trimmed });
  };

  /** 더보기 클릭 시: 섹션별 상세 페이지로 이동 (현재 검색어 유지) */
  const handleSeeMore = (type: 'notice' | 'board' | 'news') => {
    const q = (searchParams.get('keyword') ?? searchParams.get('search') ?? initialContent).trim();
    const qs = q ? `?keyword=${encodeURIComponent(q)}&search=${encodeURIComponent(q)}` : '';
    const to = type === 'notice' ? '/notice' : type === 'board' ? '/boards' : '/news';
    navigate(`${to}${qs}`);
  };

  return (
    <div className='p-4 md:p-8 flex flex-col gap-4 md:gap-12'>
      <SearchBar initialContent={initialContent} onSubmit={handleSubmitFromSearchBar} />
      <div className='flex gap-3 md:gap-6 overflow-auto no-scrollbar'>
        <Chip selected>전체</Chip>
        <Chip>공지사항</Chip>
        <Chip>명대신문</Chip>
        <Chip>자유게시판</Chip>
        <Chip>제휴</Chip>
        <Chip>취업후기</Chip>
      </div>
      <Divider variant='default' />
      <div className='flex flex-col gap-12 md:gap-24'>
        {/*
         * 공지사항 검색결과 binding
         */}
        <div className='flex flex-col gap-3'>
          <Typography variant='heading02' className='text-mju-primary'>
            공지사항
          </Typography>
          <div className='border-2 border-grey-05 rounded-lg flex flex-col p-3 gap-3'>
            {noticeItems.map((notice, idx) => (
              <>
                <SearchResultItem
                  key={notice.id}
                  variant='notice'
                  category={notice.category}
                  title={notice.highlightedTitle}
                  link={notice.link}
                />
                {idx < noticeItems.length - 1 && <Divider variant='thin' />}
              </>
            ))}
            {noticeItems.length === 0 && (
              <div className='min-h-20 flex justify-center items-center'>
                <Typography>검색 결과가 없습니다</Typography>
              </div>
            )}
          </div>
          {noticeItems.length === 5 && (
            <button
              onClick={() => handleSeeMore('notice')}
              className='self-center w-fit px-4 py-2 gap-2.5 bg-grey-05 rounded-lg cursor-pointer'
            >
              <Typography variant='body03'>더보기</Typography>
            </button>
          )}
        </div>
        {/*
         * 자유게시판 검색결과 binding
         */}
        <div className='flex flex-col gap-3'>
          <Typography variant='heading02' className='text-mju-primary'>
            자유게시판
          </Typography>
          <div className='border-2 border-grey-05 rounded-lg flex flex-col p-3 gap-3'>
            {boardItems.map((board, idx) => (
              <>
                <SearchResultItem
                  key={board.id}
                  variant='community'
                  category={board.category}
                  imageUrl={board.imageUrl}
                  title={board.highlightedTitle}
                  link={board.link}
                />
                {idx < boardItems.length - 1 && <Divider variant='thin' />}
              </>
            ))}
            {boardItems.length === 0 && (
              <div className='min-h-20 flex justify-center items-center'>
                <Typography>검색 결과가 없습니다</Typography>
              </div>
            )}
          </div>
          {boardItems.length === 5 && (
            <button
              onClick={() => handleSeeMore('board')}
              className='self-center w-fit px-4 py-2 gap-2.5 bg-grey-05 rounded-lg cursor-pointer'
            >
              <Typography variant='body03'>더보기</Typography>
            </button>
          )}
        </div>
        {/*
         * 명대신문 검색결과 binding
         */}
        <div className='flex flex-col gap-3'>
          <Typography variant='heading02' className='text-mju-primary'>
            명대신문
          </Typography>
          <div className='border-2 border-grey-05 rounded-lg flex flex-col p-3 gap-3'>
            {newsItems.map((news, idx) => (
              <>
                <SearchResultItem
                  key={news.id}
                  variant='news'
                  imageUrl={news.imageUrl}
                  category={news.category}
                  title={news.highlightedTitle}
                  content={news.highlightedContent}
                  link={news.link}
                />
                {idx < newsItems.length - 1 && <Divider variant='thin' />}
              </>
            ))}
            {newsItems.length === 0 && (
              <div className='min-h-20 flex justify-center items-center'>
                <Typography>검색 결과가 없습니다</Typography>
              </div>
            )}
          </div>
          {newsItems.length === 5 && (
            <button
              onClick={() => handleSeeMore('news')}
              className='self-center w-fit px-4 py-2 gap-2.5 bg-grey-05 rounded-lg cursor-pointer'
            >
              <Typography variant='body03'>더보기</Typography>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
