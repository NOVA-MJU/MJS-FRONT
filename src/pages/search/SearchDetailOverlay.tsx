import SearchBar from '../../components/atoms/SearchBar';
import { useEffect, useState } from 'react';
import {
  getSearchAISummary,
  getSearchResult,
  type GetSearchAISummaryRes,
  type SearchResultItemRes,
} from '../../api/search';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setHomeSliderToMain } from '@/pages/HomeSlider';
import { useHeaderStore } from '@/store/useHeaderStore';
import { ScrollableTap } from '@/components/atoms/scrollableTap/index';
import { IoMdLink, IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import ReactMarkdown from 'react-markdown';
import { type Sort } from '@/components/molecules/SortButtons';
import ListEntry, { type SearchTabKey } from './ListEntry';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { Category } from '@/api/search';

type SearchResultType = Parameters<typeof getSearchResult>[1];

const tapLabel: Record<string, SearchResultType | 'ALL'> = {
  ALL: 'ALL',
  공지사항: 'NOTICE',
  학사일정: 'MJU_CALENDAR',
  학사공지: 'DEPARTMENT_NOTICE',
  게시판: 'COMMUNITY',
  명대신문: 'NEWS',
  명대뉴스: 'BROADCAST',
};

function getNoticeSectionMorePath() {
  return '/search';
}

/** 더보기 링크의 search 문자열 (? 포함) */
function getNoticeSectionMoreSearch(tab: SearchTabKey, keyword: string) {
  const params = new URLSearchParams();
  params.set('keyword', keyword);
  if (tab !== 'ALL') params.set('tab', tab);
  return `?${params.toString()}`;
}

/**
 * 모바일 검색 결과 페이지
 *
 * 통합 검색 결과를 표시하는 페이지입니다.
 * 공지사항, 자유게시판, 명대신문 검색 결과를 한 번에 보여줍니다.
 */
function isValidTab(tab: string | null): tab is SearchTabKey {
  return tab !== null && tapLabel[tab] !== undefined;
}

export default function SearchDetail() {
  const navigate = useNavigate();
  const { setActiveMainSlide } = useHeaderStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState<SearchTabKey>(() => {
    const tab = searchParams.get('tab');
    return (isValidTab(tab) ? tab : 'ALL') as SearchTabKey;
  });
  const [categoryTab, setCategoryTab] = useState<Category | string>('all');
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [noticeItems, setNoticeItems] = useState<SearchResultItemRes[]>([]);
  const [boardItems, setBoardItems] = useState<SearchResultItemRes[]>([]);
  const [newsItems, setNewsItems] = useState<SearchResultItemRes[]>([]);
  const [broadcastItems, setBroadcastItems] = useState<SearchResultItemRes[]>([]);
  const [items, setItems] = useState<SearchResultItemRes[]>([]);
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const page = pageFromUrl > 0 ? pageFromUrl - 1 : 0;
  const [totalPages, setTotalPages] = useState(1);

  const [aiSummary, setAiSummary] = useState<GetSearchAISummaryRes>({
    query: '',
    summary: '',
    document_count: 0,
    sources: [],
  });
  const [initialContent, setInitialContent] = useState('');
  const [sort, setSort] = useState<Sort>('relevance');
  const [isAiSummaryLoading, setIsAiSummaryLoading] = useState(false);

  const keyword = searchParams.get('keyword');

  /** URL의 tab 쿼리와 동기화 (ALL이면 tab 파라미터 없음) */
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (isValidTab(tab) && tab !== currentTab) setCurrentTab(tab);
  }, [searchParams]);

  const handleSetCurrentTab = (tab: string) => {
    if (!isValidTab(tab)) return;
    setCurrentTab(tab);
    const next = new URLSearchParams(searchParams);
    if (tab === 'ALL') next.delete('tab');
    else next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  /**
   * 검색 요청 function
   */
  const filterByType = (content: SearchResultItemRes[], type: string) =>
    content.filter((item) => item.type?.toLowerCase() === type.toLowerCase()).slice(0, 5);

  async function handleSearch(text: string) {
    if (currentTab === 'ALL' || tapLabel[currentTab] === 'ALL') {
      const res = await getSearchResult(text, 'all', 'all', sort);
      const content = res.content as unknown as SearchResultItemRes[];
      setNoticeItems(filterByType(content, 'notice'));
      setBoardItems(filterByType(content, 'community'));
      setNewsItems(filterByType(content, 'news'));
      setBroadcastItems(filterByType(content, 'broadcast'));
    } else {
      let type = tapLabel[currentTab];
      if (currentTab === '학사일정' && categoryTab === 'academic') type = 'NOTICE';
      const category = currentTab === '명대뉴스' ? 'all' : categoryTab;
      const res = await getSearchResult(text, type, category, sort, page, 10);
      const items = res.content as unknown as SearchResultItemRes[];
      setItems(items);
      setTotalPages(res.totalPages);
    }
  }

  async function handleGetAiSummary(text: string) {
    const res = await getSearchAISummary(text);
    setAiSummary(res);
  }

  /**
   * 페이지 변경 시 url과 함께 반영
   */
  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(newPage + 1));
    setSearchParams(newParams);
  };

  /**
   * 검색어 초기값 반영 (search parameter 반영)
   */
  useEffect(() => {
    (async () => {
      if (!keyword) {
        setInitialContent('');
        setIsAiSummaryLoading(false);
        return;
      }
      setInitialContent(keyword);
      setIsAiSummaryLoading(true);
      try {
        await handleGetAiSummary(keyword);
      } catch {
        setAiSummary((prev) => ({ ...prev, summary: '', document_count: 0, sources: [] }));
      } finally {
        setIsAiSummaryLoading(false);
      }
      try {
        await handleSearch(keyword);
      } catch {
        // 에러는 상위에서 처리
      }
    })();
  }, [keyword, page]);

  useEffect(() => {
    setSort('relevance');
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    setSearchParams(newParams);
  }, [keyword]);

  useEffect(() => {
    handleSearch(keyword ?? '');
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    setSearchParams(newParams);
  }, [sort, categoryTab]);

  useEffect(() => {
    setSort('relevance');
    if (currentTab !== '게시판' && currentTab !== '학사일정') setCategoryTab('all');
    else if (currentTab === '게시판') setCategoryTab('NOTICE');
    else if (currentTab === '학사일정') setCategoryTab('MJU_CALENDAR');
    handleSearch(keyword ?? '');
  }, [currentTab]);

  useEffect(() => {
    if (currentTab !== '학사일정') return;
    handleSearch(keyword ?? '');
  }, [categoryTab]);

  return (
    <div className='fixed inset-0 z-50 flex justify-center bg-black/30 min-[769px]:hidden'>
      <div className='flex h-full w-full flex-col bg-white'>
        {/* 검색바 */}
        <header className='flex h-[60px] min-w-0 items-center gap-4 px-4'>
          <div
            className='h-12 w-12 shrink-0 cursor-pointer'
            onClick={() => {
              setHomeSliderToMain();
              setActiveMainSlide(1);
              navigate('/');
            }}
          >
            <img
              src='/logo/ThingoSmallLogo.svg'
              className='h-full w-full object-contain'
              alt='로고'
            />
          </div>

          <div className='min-w-0 flex-1'>
            <SearchBar
              initialContent={keyword ?? undefined}
              className='bg-grey-02 w-full rounded-full border-none px-[15px] py-[9px]'
              iconClassName='text-grey-30'
            />
          </div>
        </header>
        {/* 탭 */}
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
            setCurrentTab={handleSetCurrentTab}
          />
        </section>
        <div className='no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto'>
          {/* ai요약 */}
          {currentTab === 'ALL' && (
            <section className='border-grey-10 flex flex-col gap-3.5 border-b-1 p-5'>
              <div className='text-body02 flex w-full items-center text-black'>
                <div className='flex gap-1'>
                  <p className='text-mju-primary'>AI</p>
                  <p>요약 검색 결과</p>
                </div>
              </div>

              {isAiSummaryLoading ? (
                <>
                  <div className='flex flex-col gap-2'>
                    <Skeleton className='bg-grey-10 h-5 w-3/5 rounded-full' />
                    <Skeleton className='bg-grey-10 h-5 w-3/5 rounded-full' />
                    <Skeleton className='bg-grey-10 h-5 w-3/5 rounded-full' />
                  </div>
                  <div className='text-body05 text-grey-30 flex items-center justify-between py-1'>
                    <Skeleton className='bg-grey-10 h-5 w-3/5 rounded-full' />
                    <div className='flex shrink-0 items-center gap-1'>
                      <Skeleton className='bg-grey-10 h-5 w-11 rounded-full' />
                      <span className='bg-blue-05 rounded-full p-0.5'>
                        <IoMdLink size={15} className='text-mju-primary rotate-135' />
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='text-body05 text-grey-80 break-words [&_ol]:list-decimal [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul,_ol]:pl-5'>
                    <ReactMarkdown>{aiSummary?.summary ?? ''}</ReactMarkdown>
                  </div>

                  {aiSummary.document_count > 0 && (
                    <div>
                      <div className='text-body05 text-grey-30 flex items-center justify-between py-1'>
                        <p className='line-clamp-1 w-3/4 break-words'>
                          {aiSummary.sources?.[0]?.title}
                        </p>
                        <div className='flex items-center gap-1'>
                          {aiSummary.document_count > 1 && (
                            <div
                              onClick={() => setIsLinkOpen(!isLinkOpen)}
                              className='text-caption01 bg-grey-02 text-grey-20 flex cursor-pointer items-center gap-1 rounded-full px-2'
                            >
                              +{aiSummary.document_count}
                              {isLinkOpen ? (
                                <IoIosArrowUp size={10} className='text-grey-30' />
                              ) : (
                                <IoIosArrowDown size={10} className='text-grey-30' />
                              )}
                            </div>
                          )}
                          <a
                            href={aiSummary.sources?.[0]?.url}
                            className='bg-blue-05 rounded-full p-0.5'
                          >
                            <IoMdLink size={15} className='text-mju-primary rotate-135' />
                          </a>
                        </div>
                      </div>
                      {isLinkOpen &&
                        aiSummary.sources?.slice(1).map((source, idx) => (
                          <div
                            key={idx}
                            className='text-body05 text-grey-30 flex items-center justify-between py-1'
                          >
                            <p className='line-clamp-1 w-3/4 break-words'>{source.title}</p>
                            <a href={source.url} className='bg-blue-05 rounded-full p-0.5'>
                              <IoMdLink size={15} className='text-mju-primary rotate-135' />
                            </a>
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </section>
          )}
          {/* 검색결과 */}
          <ListEntry
            currentTab={currentTab}
            noticeItems={noticeItems}
            boardItems={boardItems}
            newsItems={newsItems}
            broadcastItems={broadcastItems}
            items={items}
            keyword={keyword}
            initialContent={initialContent}
            getMorePath={getNoticeSectionMorePath}
            getMoreSearch={getNoticeSectionMoreSearch}
            sort={sort}
            onSortChange={setSort}
            categoryTab={categoryTab}
            setCategoryTab={setCategoryTab}
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
