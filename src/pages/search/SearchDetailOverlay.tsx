import SearchBar from '../../components/atoms/SearchBar';
import { useEffect, useState } from 'react';
import { getSearchOverview, getSearchResult, type SearchResultItemRes } from '../../api/search';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ScrollableTap } from '@/components/atoms/scrollableTap/index';
import { IoMdLink } from 'react-icons/io';
import SearchList from '@/components/molecules/searchList';

type SearchResultType = Parameters<typeof getSearchResult>[1];

const tapLabel: Record<string, SearchResultType | 'ALL'> = {
  ALL: 'ALL',
  공지사항: 'NOTICE',
  학사일정: 'MJU_CALENDAR',
  학사공지: 'DEPARTMENT_NOTICE',
  게시판: 'COMMUNITY',
  명대신문: 'BROADCAST',
  명대뉴스: 'NEWS',
};

/**
 * 모바일 검색 결과 페이지
 *
 * 통합 검색 결과를 표시하는 페이지입니다.
 * 공지사항, 자유게시판, 명대신문 검색 결과를 한 번에 보여줍니다.
 */
export default function SearchDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState<keyof typeof tapLabel>('ALL');
  const [noticeItems, setNoticeItems] = useState<SearchResultItemRes[]>([]);
  const [boardItems, setBoardItems] = useState<SearchResultItemRes[]>([]);
  const [newsItems, setNewsItems] = useState<SearchResultItemRes[]>([]);
  const [initialContent, setInitialContent] = useState('');

  const keyword = searchParams.get('keyword');

  /**
   * 검색어 초기값 반영 (search parameter 반영)
   */
  useEffect(() => {
    (async () => {
      if (!keyword) return;
      setInitialContent(keyword);
      try {
        await handleSearch(keyword);
      } catch {
        // 에러는 상위에서 처리
      }
    })();
  }, [keyword]);

  /**
   * 검색 요청 function
   */
  async function handleSearch(text: string) {
    if (currentTab === 'ALL' || tapLabel[currentTab] === 'ALL') {
      const res = await getSearchOverview(text);
      setNoticeItems(res.notice);
      setBoardItems(res.community);
      setNewsItems(res.news);
    } else {
      const type = tapLabel[currentTab];
      const res = await getSearchResult(text, type, 'relevance', 0, 5);
      const items = res.content as unknown as SearchResultItemRes[];
      setNoticeItems(items);
    }
  }

  useEffect(() => {
    handleSearch(keyword ?? '');
  }, [currentTab]);

  return (
    <div className='fixed inset-0 z-50 flex justify-center bg-black/30 min-[769px]:hidden'>
      <div className='flex h-full w-full flex-col bg-white'>
        <header className='flex items-center gap-4 px-4 py-2'>
          <div className='bg-blue-05 h-12 w-12' onClick={() => navigate('/')}>
            logo
          </div>

          <div className='flex-1 py-2'>
            <SearchBar
              initialContent={keyword ?? undefined}
              className='bg-grey-02 w-full rounded-full border-none px-[15px] py-[9px]'
              iconClassName='text-grey-30'
            />
          </div>
        </header>
        <section>
          <ScrollableTap
            tabs={{
              ALL: 'ALL',
              공지사항: '공지사항',
              학사일정: '학사일정',
              게시판: '게시판',
              명대신문: '명대신문',
              명대뉴스: '명대뉴스',
            }}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
          />
        </section>
        <div className='no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto'>
          <section className='border-grey-10 flex flex-col gap-3.5 border-b-1 p-5'>
            <div className='text-body02 flex w-full items-center justify-between text-black'>
              <div className='flex gap-1'>
                <p className='text-mju-primary'>AI</p>
                <p>요약 검색 결과</p>
              </div>
              <a
                href='https://www.google.com'
                className='bg-blue-05 cursor-pointer rounded-full p-1'
              >
                <IoMdLink size={20} className='text-mju-primary rotate-135' />
              </a>
            </div>
            <div className='text-body05 text-grey-80 break-words'>
              dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
            </div>
          </section>
          <div className='flex flex-col gap-5'>
            {/* 공지사항 검색결과 */}
            <div className='border-grey-02 flex flex-col border-t-[8px]'>
              <p className='text-body02 p-5 pb-2 text-black'>
                {currentTab === 'ALL' ? '공지사항' : currentTab}
              </p>
              <div className='flex flex-col'>
                <SearchList
                  items={noticeItems.map((notice) => ({
                    id: notice.id,
                    category: notice.category,
                    title: notice.highlightedTitle,
                    link: notice.link,
                    content: notice.highlightedContent,
                    date: notice.date,
                  }))}
                />
                {noticeItems.length === 0 && (
                  <div className='flex min-h-10 items-center justify-center'>
                    <p className='text-body05 text-grey-30'>검색 결과가 없습니다</p>
                  </div>
                )}
              </div>
              {noticeItems.length === 5 && (
                <Link
                  to={{ pathname: '/notice', search: `?keyword=${initialContent}` }}
                  className='bg-grey-05 w-fit cursor-pointer gap-2.5 self-center rounded-lg px-4 py-2'
                >
                  <p className='text-body05 text-grey-30'>더보기</p>
                </Link>
              )}
            </div>
            {/* 커뮤니티 검색결과 */}
            {tapLabel[currentTab] === 'ALL' && (
              <>
                <div className='flex flex-col gap-3'>
                  <p className='text-body02 p-5 pb-2 text-black'>커뮤니티</p>
                  <div className='flex flex-col'>
                    <SearchList
                      items={boardItems.map((board) => ({
                        id: board.id,
                        category: board.category,
                        title: board.highlightedTitle,
                        link: board.link,
                        content: board.highlightedContent,
                        date: board.date,
                      }))}
                    />
                    {boardItems.length === 0 && (
                      <div className='flex min-h-10 items-center justify-center'>
                        <p className='text-body05 text-grey-30'>검색 결과가 없습니다</p>
                      </div>
                    )}
                  </div>
                  {boardItems.length === 5 && (
                    <Link
                      to={{ pathname: '/board', search: `?keyword=${initialContent}` }}
                      className='bg-grey-05 w-fit cursor-pointer gap-2.5 self-center rounded-lg px-4 py-2'
                    >
                      <p className='text-body05 text-grey-30'>더보기</p>
                    </Link>
                  )}
                </div>

                {/* 명대신문 검색결과 */}
                <div className='flex flex-col gap-3'>
                  <p className='text-body02 p-5 pb-2 text-black'>명대신문</p>
                  <div className='flex flex-col'>
                    <SearchList
                      items={newsItems.map((news) => ({
                        id: news.id,
                        category: news.category,
                        title: news.highlightedTitle,
                        link: news.link,
                        content: news.highlightedContent,
                        date: news.date,
                      }))}
                    />
                    {newsItems.length === 0 && (
                      <div className='flex min-h-10 items-center justify-center'>
                        <p className='text-body05 text-grey-30'>검색 결과가 없습니다</p>
                      </div>
                    )}
                  </div>
                  {newsItems.length === 5 && (
                    <Link
                      to={{ pathname: '/news', search: `?keyword=${initialContent}` }}
                      className='bg-grey-05 w-fit cursor-pointer gap-2.5 self-center rounded-lg px-4 py-2'
                    >
                      <p className='text-body05 text-grey-30'>더보기</p>
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
