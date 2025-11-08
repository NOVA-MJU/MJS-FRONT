import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatToLocalDate } from '@/utils';
import { fetchBroadcasts, searchBroadcasts, type BroadcastItem } from '@/api/main/broadcast-api';
import LoadingIndicator from '@/components/atoms/LoadingIndicator';
import Pagination from '@/components/molecules/common/Pagination';
import { useResponsive } from '@/hooks/useResponse';
import SearchBar from '@/components/atoms/SearchBar';
import { HighlightedText } from '@/components/atoms/HighlightedText';

const PAGE_SIZE = 9;

export default function Broadcast() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const [initialKeyword, setInitialKeyword] = useState('');

  const { id } = useParams<{ id: string }>();
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<BroadcastItem[]>([]);
  const { isDesktop } = useResponsive();

  /**
   * 주소에 search parameter 값이 있으면 검색바에 반영합니다
   */
  useEffect(() => {
    if (keyword) setInitialKeyword(keyword);
    else setInitialKeyword('');
  }, [keyword]);

  useEffect(() => {
    /**
     * 검색어 없는 경우 모든 데이터 조회
     */
    if (!keyword) {
      (async () => {
        try {
          setIsLoading(true);
          const res = await fetchBroadcasts(page, PAGE_SIZE);
          setTotalPage(res.totalPages);
          setContents(res.content);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      })();
    }

    /**
     * 검색어 있는 경우 검색 요청
     */
    if (keyword) {
      (async () => {
        try {
          setIsLoading(true);
          const res = await searchBroadcasts(keyword, 'relevance', page, PAGE_SIZE);
          console.log(res);
          setContents(res.data);
          setTotalPage(res.totalPages);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [id, page, keyword]);

  if (isLoading) return <LoadingIndicator />;

  /**
   * 데스크톱 페이지
   */
  if (isDesktop)
    return (
      <div className='flex-1 flex flex-col gap-4 md:gap-8 p-4 md:p-8'>
        <Link to='/broadcast'>
          <h2 className='text-heading01 text-mju-primary'>명대방송</h2>
        </Link>
        <SearchBar domain='broadcast' initialContent={initialKeyword} />
        <div className='flex-1 w-full'>
          <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6'>
            {contents.map((content) => (
              <article
                key={content.url}
                className='border rounded-md overflow-hidden bg-white shadow-sm hover:shadow transition-shadow'
              >
                <div className='w-full aspect-video relative'>
                  <iframe
                    className='w-full h-54 rounded-t-xl'
                    src={`https://www.youtube.com/embed/${extractYoutubeId(content.url)}`}
                    title={content.title}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  />
                </div>
                <div className='p-3'>
                  <HighlightedText className='text-sm md:text-base font-semibold line-clamp-2'>
                    {content.title}
                  </HighlightedText>
                  <p className='mt-1 text-xs text-gray-500'>
                    {formatToLocalDate(content.publishedAt)}
                  </p>
                </div>
              </article>
            ))}
          </section>
        </div>
        <Pagination page={page} totalPages={totalPage} onChange={setPage} />
      </div>
    );

  /**
   * 모바일 페이지
   */
  if (!isDesktop)
    return (
      <div className='p-5 flex-1 flex flex-col gap-6'>
        <div className='flex flex-col gap-3'>
          <Link to='/broadcast'>
            <h2 className='text-title01 text-blue-35'>명대뉴스</h2>
          </Link>
          <SearchBar domain='broadcast' initialContent={initialKeyword} />
        </div>

        {/* 방송국 목록 표시 */}
        <div className='flex-1 flex flex-col gap-2'>
          {contents.map((content) => {
            return (
              <article key={content.url} className='flex flex-col gap-1'>
                <iframe
                  className='w-full h-54 rounded-lg'
                  src={`https://www.youtube.com/embed/${extractYoutubeId(content.url)}`}
                  title={content.title}
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
                <div className='px-4 py-2 border border-grey-10 rounded-lg'>
                  <div className='flex flex-col gap-1'>
                    <HighlightedText className='text-body04 text-black'>
                      {content.title}
                    </HighlightedText>
                    {content.playlistTitle && (
                      <HighlightedText className='text-body05 text-grey-40'>
                        {content.playlistTitle}
                      </HighlightedText>
                    )}
                    <span className='text-caption04 text-grey-40'>
                      {formatToLocalDate(content.publishedAt)}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* 페이지네이션 */}
        <Pagination page={page} totalPages={totalPage} onChange={setPage} />
      </div>
    );
}

/**
 *
 * @param url
 * @returns
 */
const extractYoutubeId = (url: string): string => {
  let match = url.match(/v=([^&]+)/);
  if (match) return match[1];
  match = url.match(/youtu\.be\/([^?]+)/);
  if (match) return match[1];
  return '';
};
