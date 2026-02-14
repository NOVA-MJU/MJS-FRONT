import { FaSearch } from 'react-icons/fa';
import { IoCloseCircle } from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { GoArrowUpRight } from 'react-icons/go';
import { useDebounce } from '@/hooks/useDebounce';
import { getSearchWordcompletion } from '@/api/search';
import { addRecentKeyword } from '@/utils/recentSearch';
import { useAuthStore } from '@/store/useAuthStore';

interface SearchBarProps {
  /**
   * domain을 설정하면, 검색 수행 시 해당 domain에 맞는 페이지로 이동됩니다
   */
  domain?: 'search' | 'notice' | 'news' | 'board' | 'broadcast';

  /**
   * initialContent를 설정하면 검색바가 렌더링될 때 해당 content가 입력된 상태로 렌더링됩니다
   */
  initialContent?: string;

  className?: string;
  iconClassName?: string;
}

/**
 * 검색바 컴포넌트
 * @param domain 검색을 수행할 domain을 입력하세요. 검색 수행 시 해당 domain 페이지에서 검색을 수행합니다. 기본값은 search 이고, 기본값일 경우 검색 수행 시 통합검색 페이지로 이동됩니다.
 * @param initialContent 검색바가 렌더링될 때 initialContent가 입력된 상태로 렌더링됩니다
 * @param className 스타일을 입력하세요
 */
export default function SearchBar({
  domain = 'search',
  initialContent,
  className,
  iconClassName,
}: SearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const recentSearchScope = user?.uuid ?? undefined;
  const [value, setValue] = useState('');

  /** 통합검색(domain=search)일 때 기존 쿼리(tab 등) 유지 */
  const getSearchQuery = (keyword: string) => {
    if (domain !== 'search' || !keyword.trim())
      return `?keyword=${encodeURIComponent(keyword.trim())}`;
    const next = new URLSearchParams();
    next.set('keyword', keyword.trim());
    const tab = searchParams.get('tab');
    if (tab) next.set('tab', tab);
    return `?${next.toString()}`;
  };
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const initialized = useRef(true);
  const prevLengthRef = useRef(0);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 검색어 초기값을 받을 경우
   */
  useEffect(() => {
    if (initialContent) {
      initialized.current = false;
      setValue(initialContent);
      setSuggestedKeywords([]);
    }
  }, [initialContent]);

  /**
   * 검색어 자동완성
   * `useDebounce`는 검색어 입력 후 0.1초 내에 키보드를 다시 입력하는 경우 검색어 자동완성을 수행하지 않도록 합니다 (트래픽 절약)
   */
  const debounced = useDebounce(value, 50);
  useEffect(() => {
    if (!debounced.trim()) return;
    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    (async () => {
      try {
        const res = await getSearchWordcompletion(debounced.trim());
        if (!controller.signal.aborted) {
          if (res.length !== 0) setSuggestedKeywords(res);
        }
      } catch {
        // 에러는 상위에서 처리 (abort된 경우 무시)
        // 자동완성 실패는 조용히 처리
      }
    })();
  }, [debounced]);

  /**
   * 자동완성 키워드 아이템 클릭
   * 현재 경로와 클릭한 키워드의 목적지 경로가 같으면 화면을 새로고침
   */
  const handleKeywordClick = (keyword: string) => {
    addRecentKeyword(keyword, undefined, recentSearchScope);
    const search = getSearchQuery(keyword);
    if (location.pathname === `/${domain}` && location.search === search) {
      window.location.reload();
    } else {
      navigate({
        pathname: `/${domain}`,
        search,
      });
    }
  };

  /**
   * 검색어를 지울 경우 검색어 자동완성 창 자동 닫기
   */
  useEffect(() => {
    // 완전히 비워졌을 때는 항상 닫기
    if (value.length === 0) {
      setSuggestedKeywords([]);
    }

    // 백스페이스 등으로 글자가 줄어들면 추천을 즉시 닫아 UX를 자연스럽게 유지
    if (value.length < prevLengthRef.current) {
      setSuggestedKeywords([]);
    }

    prevLengthRef.current = value.length;
  }, [value]);

  /**
   * 검색창 외부 클릭 시 자동완성 창 닫기
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        handleCloseBox();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchBarRef]);

  /**
   * 검색어 자동완성 창 닫기 버튼 핸들러
   */
  const handleCloseBox = () => {
    setSuggestedKeywords([]);
  };

  /**
   * 검색 수행 핸들러 (엔터 클릭 시)
   */
  const handleSubmitSearch = () => {
    abortControllerRef.current?.abort();
    setSuggestedKeywords([]);

    if (value?.trim()) {
      addRecentKeyword(value, undefined, recentSearchScope);
      navigate({
        pathname: `/${domain}`,
        search: getSearchQuery(value.trim()),
      });
    } else {
      navigate({
        pathname: `/${domain}`,
      });
    }
    setSuggestedKeywords([]);
  };

  return (
    <div className='relative' ref={searchBarRef}>
      {/* 검색바 */}
      <div
        className={twMerge(
          clsx(
            'border-blue-35 flex items-center gap-3 border-2 bg-white px-5 py-3 transition-all md:shadow-sm md:hover:shadow-md',
            suggestedKeywords.length === 0 ? 'rounded-full' : 'rounded-t-2xl border-b-0',
          ),
          className,
        )}
      >
        {!value.trim() && (
          <p
            className={twMerge(
              clsx('text-body04 md:text-body01 text-blue-35 cursor-pointer', iconClassName),
            )}
          >
            <FaSearch />
          </p>
        )}
        <div className='flex min-w-0 flex-1 flex-row'>
          <input
            type='text'
            className='text-body06 md:text-body01 placeholder-grey-20 min-w-0 flex-1 shrink bg-transparent text-black outline-none'
            placeholder={'검색어를 입력하세요'}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmitSearch();
              }
            }}
          />
          {value.trim() && (
            <div>
              <IoCloseCircle
                className='text-grey-20 h-5 w-5 cursor-pointer'
                onClick={() => setValue('')}
              />
            </div>
          )}
        </div>
      </div>

      {/* 키워드 자동완성 박스 */}
      {suggestedKeywords.length !== 0 && (
        <div className='absolute top-full left-0 z-50 mt-1 w-full'>
          <div className='ring-blue-05 flex flex-col gap-1 rounded-2xl bg-white/95 shadow-lg ring-1 backdrop-blur-sm'>
            <div className='border-blue-05/40 flex max-h-80 flex-col overflow-y-auto border-b'>
              {suggestedKeywords.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleKeywordClick(item);
                  }}
                  className='text-body04 text-grey-90 hover:bg-blue-05/40 active:bg-blue-05/60 flex h-fit w-full items-center gap-3 px-4 py-2.5 text-left transition'
                >
                  <span className='bg-blue-05 text-blue-35 flex h-7 w-7 items-center justify-center rounded-full text-xs'>
                    <FaSearch />
                  </span>
                  <span className='text-body03 flex-1 truncate text-start'>{item}</span>
                  <GoArrowUpRight className='text-blue-35' />
                </button>
              ))}
            </div>
            <a
              className='text-caption02 text-grey-40 w-fit self-end px-4 py-2 underline-offset-2 hover:underline'
              onClick={handleCloseBox}
            >
              닫기
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
