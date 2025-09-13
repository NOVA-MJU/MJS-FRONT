import { FaSearch } from 'react-icons/fa';
import { Typography } from '../Typography';
import { useEffect, useRef, useState } from 'react';
import { getSearchWordcompletion } from '../../../api/search';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoArrowUpRight } from 'react-icons/go';
import { useDebounce } from '../../../hooks/useDebounce';

interface SearchBarProps {
  /**
   * domain을 설정하면, 검색 수행 시 해당 domain에 맞는 페이지로 이동됩니다
   */
  domain?: 'search' | 'notice' | 'news' | 'board';

  /**
   * initialContent를 설정하면 검색바가 렌더링될 때 해당 content가 입력된 상태로 렌더링됩니다
   */
  initialContent?: string;

  className?: string;
}

export default function SearchBar({
  domain = 'search',
  initialContent,
  className,
}: SearchBarProps) {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const initialized = useRef(true);
  const searchBarRef = useRef<HTMLDivElement>(null);

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
   */
  const debounced = useDebounce(value, 100);

  useEffect(() => {
    if (!debounced.trim()) return;
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    (async () => {
      try {
        const res = await getSearchWordcompletion(debounced.trim());
        console.log(res);
        if (res.length !== 0) setSuggestedKeywords(res);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [debounced]);

  /**
   * 검색어를 지울 경우 검색어 자동완성 닫기
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

    // document에 mousedown 이벤트 리스너를 추가합니다.
    document.addEventListener('mousedown', handleClickOutside);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다. (메모리 누수 방지)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchBarRef]); // ref는 변경되지 않으므로 이 effect는 마운트 시 한 번만 실행됩니다.

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
    if (value)
      navigate({
        pathname: `/${domain}`,
        search: `?keyword=${encodeURIComponent(value.trim())}`,
      });
    else
      navigate({
        pathname: `/${domain}`,
      });
  };

  return (
    <div className='relative' ref={searchBarRef}>
      <div
        className={clsx(
          'flex items-center bg-white border-grey-05 p-4 gap-3',
          suggestedKeywords.length === 0
            ? 'border rounded-lg'
            : 'border-t border-s border-e rounded-t-lg',
          className,
        )}
      >
        <Typography variant='body03' className='text-grey-20'>
          <FaSearch />
        </Typography>
        <input
          type='text'
          className='flex-1 bg-transparent outline-none text-lg text-black placeholder-grey-20'
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
      {/*
       * 자동완성 키워드가 있는 경우 자동완성 박스가 표시됩니다.
       */}
      {suggestedKeywords.length !== 0 && (
        <div className='w-full absolute top-full z-50'>
          <div className='bg-white border border-grey-05 rounded-b-lg flex flex-col gap-1'>
            <div className='flex flex-col gap-1 max-h-80 overflow-y-auto border-b border-grey-05'>
              {suggestedKeywords.map((item) => (
                <Keyword text={item} />
              ))}
            </div>
            <a
              className='w-fit self-end py-2 px-4 text-grey-40 cursor-pointer'
              onClick={handleCloseBox}
            >
              <Typography variant='caption02'>닫기</Typography>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 자동완성 아이템
 */
interface KeywordProps {
  text: string;
}

function Keyword({ text }: KeywordProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const targetPathname = '/search';
  const targetSearch = `?keyword=${encodeURIComponent(text)}`;
  const targetUrl = targetPathname + targetSearch;

  /**
   * 자동완성 키워드 아이템 클릭
   */
  const handleClick = () => {
    // 현재 경로와 클릭한 키워드의 목적지 경로가 같은지 확인
    if (location.pathname === targetPathname && location.search === targetSearch) {
      // 경로가 같다면 페이지를 새로고침하여 데이터를 다시 불러옴
      window.location.reload();
    } else {
      // 경로가 다르다면 해당 경로로 이동
      navigate(targetUrl);
    }
  };

  return (
    <div
      onClick={handleClick}
      className='px-5 py-3 flex gap-3 items-center cursor-pointer hover:bg-gray-100' // 스타일링을 위해 cursor-pointer와 hover 효과 추가
    >
      <FaSearch className='text-grey-20 text-xl p-1 bg-grey-05 rounded-full' />
      <Typography variant='body03' className='flex-1'>
        {text}
      </Typography>
      <GoArrowUpRight />
    </div>
  );
}
