import { FaSearch } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoArrowUpRight } from 'react-icons/go';
import { useDebounce } from '@/hooks/useDebounce';
import { getSearchWordcompletion } from '@/api/search';

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
}: SearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState('');
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const initialized = useRef(true);
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
  const debounced = useDebounce(value, 100);
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
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error(e);
        }
      }
    })();
  }, [debounced]);

  /**
   * 자동완성 키워드 아이템 클릭
   * 현재 경로와 클릭한 키워드의 목적지 경로가 같으면 화면을 새로고침
   */
  const handleKeywordClick = (keyword: string) => {
    console.log(domain);
    if (
      location.pathname === `/${domain}` &&
      location.search === `?keyword=${encodeURIComponent(keyword)}`
    ) {
      window.location.reload();
    } else {
      navigate({
        pathname: `/${domain}`,
        search: `?keyword=${encodeURIComponent(keyword.trim())}`,
      });
    }
  };

  /**
   * 검색어를 지울 경우 검색어 자동완성 창 자동 닫기
   */
  useEffect(() => {
    if (value.length === 0) setSuggestedKeywords([]);
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

    if (value)
      navigate({
        pathname: `/${domain}`,
        search: `?keyword=${encodeURIComponent(value.trim())}`,
      });
    else
      navigate({
        pathname: `/${domain}`,
      });
    setSuggestedKeywords([]);
  };

  return (
    <div className='relative' ref={searchBarRef}>
      {/* 검색바 */}
      <div
        className={clsx(
          'flex items-center bg-white border-grey-05 p-4 gap-3',
          suggestedKeywords.length === 0
            ? 'border rounded-lg'
            : 'border-t border-s border-e rounded-t-lg',
          className,
        )}
      >
        <p className='text-body04 md:text-body01 text-grey-20'>
          <FaSearch />
        </p>
        <input
          type='text'
          className='text-body04 md:text-body01 flex-1 bg-transparent outline-none text-black placeholder-grey-20'
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
      </div>

      {/* 키워드 자동완성 박스 */}
      {suggestedKeywords.length !== 0 && (
        <div className='w-full absolute top-full z-50'>
          <div className='bg-white border border-grey-05 rounded-b-lg flex flex-col gap-1'>
            <div className='flex flex-col max-h-80 overflow-y-auto border-b border-grey-05'>
              {suggestedKeywords.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleKeywordClick(item);
                  }}
                  className='w-full h-fit px-5 py-3 flex gap-3 items-center cursor-pointer hover:bg-grey-05 transition hover:duration-0'
                >
                  <FaSearch className='text-grey-20 text-xl p-1 bg-grey-05 rounded-full' />
                  <span className='text-body03 flex-1 text-start'>{item}</span>
                  <GoArrowUpRight />
                </button>
              ))}
            </div>
            <a
              className='w-fit self-end py-2 px-4 text-caption02 text-grey-40 cursor-pointer'
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
