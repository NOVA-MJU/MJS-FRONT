import SearchBar from '../../components/atoms/SearchBar';
import { useEffect, useState } from 'react';
import {
  getSearchAISummary,
  getSearchOverview,
  getSearchResult,
  type GetSearchAISummaryRes,
  type SearchResultItemRes,
} from '../../api/search';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ScrollableTap } from '@/components/atoms/scrollableTap/index';
import { IoMdLink } from 'react-icons/io';
import { HighlightedText } from '@/components/atoms/HighlightedText';
import { type Sort } from '@/components/molecules/SortButtons';
import ListEntry, { type SearchTabKey } from './ListEntry';

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

/** 탭별 공지/방송 섹션 "더보기" 경로 */
const NOTICE_SECTION_MORE_PATH: Record<SearchTabKey, string> = {
  ALL: '/notice',
  공지사항: '/notice',
  학사일정: '/academic-calendar',
  학사공지: '/department',
  게시판: '/board',
  명대신문: '/broadcast',
  명대뉴스: '/news',
};

function getNoticeSectionMorePath(tab: SearchTabKey) {
  return NOTICE_SECTION_MORE_PATH[tab] ?? '/notice';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState<SearchTabKey>(() => {
    const tab = searchParams.get('tab');
    return (isValidTab(tab) ? tab : 'ALL') as SearchTabKey;
  });
  const [categoryTab, setCategoryTab] = useState<string>('all');
  const [noticeItems, setNoticeItems] = useState<SearchResultItemRes[]>([]);
  const [boardItems, setBoardItems] = useState<SearchResultItemRes[]>([]);
  const [newsItems, setNewsItems] = useState<SearchResultItemRes[]>([]);
  const [items, setItems] = useState<SearchResultItemRes[]>([]);

  const [aiSummary, setAiSummary] = useState<GetSearchAISummaryRes>({
    query: '',
    summary: '',
    document_count: 0,
    source_links: [],
  });
  const [initialContent, setInitialContent] = useState('');
  const [sort, setSort] = useState<Sort>('relevance');

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
  async function handleSearch(text: string) {
    if (currentTab === 'ALL' || tapLabel[currentTab] === 'ALL') {
      const res = await getSearchOverview(text, sort);
      setNoticeItems(res.notice);
      setBoardItems(res.community);
      setNewsItems(res.news);
    } else {
      let type = tapLabel[currentTab];
      if (categoryTab === 'department') {
        type = 'DEPARTMENT_NOTICE';
      }
      const res = await getSearchResult(text, type, sort, 0, 5);
      const items = res.content as unknown as SearchResultItemRes[];
      setItems(items);
    }
  }

  async function handleGetAiSummary(text: string) {
    const res = await getSearchAISummary(text);
    setAiSummary(res);
  }

  /**
   * 검색어 초기값 반영 (search parameter 반영)
   */
  useEffect(() => {
    //추후 로직 수정
    if (currentTab === 'ALL') handleGetAiSummary(keyword ?? '');
    setSort('relevance');
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

  useEffect(() => {
    handleSearch(keyword ?? '');
  }, [sort, categoryTab]);

  useEffect(() => {
    setSort('relevance');
    setCategoryTab('all');
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
                <HighlightedText>{aiSummary.summary}</HighlightedText>
              </div>
            </section>
          )}
          {/* 검색결과 */}
          <ListEntry
            currentTab={currentTab}
            noticeItems={noticeItems}
            boardItems={boardItems}
            newsItems={newsItems}
            items={items}
            keyword={keyword}
            initialContent={initialContent}
            getMorePath={getNoticeSectionMorePath}
            sort={sort}
            onSortChange={setSort}
            categoryTab={categoryTab}
            setCategoryTab={setCategoryTab}
          />
        </div>
      </div>
    </div>
  );
}
