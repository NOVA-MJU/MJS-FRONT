import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import NoticeItem from '@/components/molecules/NoticeItem';
import NewsCard from '@/pages/news/NewsCard';
import BroadcastCard from '@/pages/broadcast/BroadcastCard';
import BoardCard from '@/pages/board/BoardCard';
import SortButtons, { type Sort } from '@/components/molecules/SortButtons';
import type { SearchResultItemRes } from '@/api/search';
import { ChipTabs, SegmentedControlTabs } from '@/components/atoms/Tabs';
import { filterByCategoryTab, type FilterCategory } from '@/utils/filterList';
import AcademicCalendar from '../academic-calendar';

export type SearchTabKey =
  | 'ALL'
  | '공지사항'
  | '학사일정'
  | '학사공지'
  | '게시판'
  | '명대신문'
  | '명대뉴스';

interface ListEntryProps {
  currentTab: SearchTabKey;
  noticeItems: SearchResultItemRes[];
  boardItems: SearchResultItemRes[];
  newsItems: SearchResultItemRes[];
  items: SearchResultItemRes[];
  keyword: string | null;
  initialContent: string;
  getMorePath: (tab: SearchTabKey) => string;
  sort: Sort;
  onSortChange: (sort: Sort) => void;
  categoryTab: string;
  setCategoryTab: (tab: string) => void;
}

const NewsLabel: Record<string, string> = {
  all: '전체',
  report: '보도',
  society: '사회',
};

const NoticeLabel: Record<string, string> = {
  all: '전체',
  general: '일반',
  academic: '학사',
  scholarship: '장학',
  career: '진로',
  activity: '학생활동',
  rule: '학칙개정',
};

const DepartmentLabel: Record<string, string> = {
  all: '캘린더',
  department: '학사공지',
};

const CommunityLabel: Record<string, string> = {
  all: '정보 게시판',
  free: '자유 게시판',
};

const EMPTY_MESSAGE_CLASS =
  'flex h-26 items-center justify-center mx-5 border-1 border-grey-10 rounded-[4px]';

// 검색 결과 아이템 렌더링
function renderItem(item: SearchResultItemRes, tab: SearchTabKey): ReactNode {
  if (tab === '명대뉴스') {
    return (
      <BroadcastCard
        key={item.id}
        title={item.highlightedTitle}
        url={item.link}
        playlistTitle={item.highlightedContent}
        publishedAt={item.date}
      />
    );
  }
  if (tab === '명대신문') {
    return (
      <NewsCard
        key={item.id}
        news={{
          title: item.highlightedTitle,
          date: item.date,
          reporter: item.type,
          imageUrl: item.imageUrl,
          summary: item.highlightedContent,
          link: item.link,
          category: 'ALL',
        }}
      />
    );
  }
  if (tab === '게시판') {
    return (
      <BoardCard
        key={item.id}
        id={item.id}
        title={item.highlightedTitle}
        previewContent={item.highlightedContent}
        likeCount={0}
        commentCount={0}
        publishedAt={item.date}
        isPopular={false}
      />
    );
  }
  return (
    <NoticeItem
      key={item.id}
      id={item.id}
      category={item.category ?? '학사'}
      title={item.highlightedTitle}
      date={item.date}
      link={item.link}
    />
  );
}

// 검색 결과 헤더, all일 경우
function SectionHeader({
  title,
  showMore,
  moreTo,
  moreSearch,
}: {
  title: string;
  showMore: boolean;
  moreTo: string;
  moreSearch: string;
}) {
  return (
    <div className='flex items-center justify-between'>
      <p className='text-body02 px-5 py-2 text-black'>{title}</p>
      {showMore && (
        <Link
          to={{ pathname: moreTo, search: `?keyword=${moreSearch}` }}
          className='mt-3 mr-5 w-fit cursor-pointer'
        >
          <p className='text-body05 text-grey-30'>
            <IoIosArrowForward size={20} />
          </p>
        </Link>
      )}
    </div>
  );
}

// 검색 결과 없을 경우
function EmptyState({ keyword }: { keyword: string | null }) {
  return (
    <div className={EMPTY_MESSAGE_CLASS}>
      <p className='text-body05 text-grey-30'>'{keyword ?? ''}'을 찾을 수 없습니다.</p>
    </div>
  );
}

//버튼 탭 유무와 리스트 설정 반환
function tabName(currentTab: SearchTabKey) {
  if (currentTab === '공지사항') {
    return NoticeLabel;
  } else if (currentTab === '명대신문' || currentTab === '명대뉴스') {
    return NewsLabel;
  } else if (currentTab === '학사일정') {
    return DepartmentLabel;
  } else if (currentTab === '게시판') {
    return CommunityLabel;
  }
  return {};
}

/** 단일 탭에서 ChipTabs/SegmentedControlTabs용 FilterCategory 매핑 (학사일정·학사공지는 필터 미적용) */
const TAB_TO_FILTER_CATEGORY: Partial<Record<SearchTabKey, FilterCategory>> = {
  게시판: 'COMMUNITY',
  공지사항: 'NOTICE',
  명대신문: 'NEWS',
  명대뉴스: 'BROADCAST',
};

export default function ListEntry({
  currentTab,
  noticeItems,
  boardItems,
  newsItems,
  items,
  keyword,
  initialContent,
  getMorePath,
  sort,
  onSortChange,
  categoryTab,
  setCategoryTab,
}: ListEntryProps) {
  // tab이 all일 경우 3가지 카테고리 출력
  if (currentTab === 'ALL') {
    return (
      <div className='flex flex-col gap-5'>
        {/* 공지사항 */}
        <div className='border-grey-02 flex flex-col border-t-[8px]'>
          <div className='flex flex-row items-center justify-between p-5 pb-0'>
            <SortButtons sort={sort} onSortChange={onSortChange} />
          </div>
          <SectionHeader
            title='공지사항'
            showMore={noticeItems.length === 5}
            moreTo={getMorePath('ALL')}
            moreSearch={initialContent}
          />
          <div className='flex flex-col'>
            {noticeItems.map((notice) => renderItem(notice, '공지사항'))}
            {noticeItems.length === 0 && <EmptyState keyword={keyword} />}
          </div>
        </div>

        {/* 커뮤니티 */}
        <div className='mt-3 flex flex-col'>
          <SectionHeader
            title='커뮤니티'
            showMore={boardItems.length === 5}
            moreTo='/board'
            moreSearch={initialContent}
          />
          <div className='flex flex-col'>
            {boardItems.map((board) => renderItem(board, '게시판'))}
            {boardItems.length === 0 && <EmptyState keyword={keyword} />}
          </div>
        </div>

        {/* 명대신문 */}
        <div className='mt-3 flex flex-col'>
          <SectionHeader
            title='명대신문'
            showMore={newsItems.length === 5}
            moreTo='/news'
            moreSearch={initialContent}
          />
          <div className='flex flex-col'>
            {newsItems.map((news) => (
              <NewsCard
                key={news.id}
                news={{
                  title: news.highlightedTitle,
                  date: news.date,
                  reporter: news.type,
                  imageUrl: news.imageUrl,
                  summary: news.highlightedContent,
                  link: news.link,
                  category: 'ALL',
                }}
              />
            ))}
            {newsItems.length === 0 && <EmptyState keyword={keyword} />}
          </div>
        </div>
      </div>
    );
  }

  /* 단일 탭: 공지사항 / 학사일정 / 게시판 / 명대신문 / 명대뉴스 — categoryTab에 따라 필터 */
  const filterCategory = TAB_TO_FILTER_CATEGORY[currentTab];
  const filteredItems =
    filterCategory != null ? filterByCategoryTab(items, filterCategory, categoryTab) : items;

  return (
    <div className='flex flex-col gap-5'>
      <div
        className={`flex flex-col ${currentTab === '학사일정' || currentTab === '게시판' ? '' : 'pt-3'}`}
      >
        {(currentTab === '학사일정' || currentTab === '게시판') && (
          <SegmentedControlTabs
            tabs={tabName(currentTab) ?? {}}
            currentTab={categoryTab}
            setCurrentTab={setCategoryTab}
          />
        )}
        {(currentTab === '공지사항' || currentTab === '명대신문' || currentTab === '명대뉴스') && (
          // 전체, 보도, 사회 이런 버튼이 있을 경우 칩 탭 출력
          <div className='px-5 pt-2'>
            <ChipTabs
              tabs={tabName(currentTab) ?? {}}
              currentTab={categoryTab}
              setCurrentTab={setCategoryTab}
            />
          </div>
        )}

        {/* 더보기 버튼과 sort 관리 */}
        <div className='flex flex-row items-center justify-between px-5 py-2'>
          {(categoryTab !== 'all' || currentTab !== '학사일정') && (
            <SortButtons sort={sort} onSortChange={onSortChange} />
          )}
          {filteredItems.length > 5 && (
            <Link
              to={{ pathname: getMorePath(currentTab), search: `?keyword=${initialContent}` }}
              className='w-fit cursor-pointer'
            >
              <p className='text-body05 text-grey-30'>
                <IoIosArrowForward size={20} />
              </p>
            </Link>
          )}
        </div>

        {/* 학사일정 카테고리일 경우 학사일정 캘린더 출력, 나머지는 필터링 한 결과 출력 */}
        <div className='flex flex-col'>
          {categoryTab === 'all' && currentTab === '학사일정' && <AcademicCalendar />}
          {filteredItems.map((item) => renderItem(item, currentTab))}
          {filteredItems.length === 0 && <EmptyState keyword={keyword} />}
        </div>
      </div>
    </div>
  );
}
