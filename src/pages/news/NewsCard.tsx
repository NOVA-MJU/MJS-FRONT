import DOMPurify from 'dompurify';
import { NewsCategoryLabel } from '../../constants/news';
import type { NewsInfo } from '../../types/news/newsInfo';
import { formatToLocalDate } from '../../utils';
import { useResponsive } from '@/hooks/useResponse';

interface NewsCardProps {
  news: NewsInfo;
  fallbackSrc?: string;
}

/**
 * 명대신문 카드 컴포넌트
 *
 * 명대신문 기사를 카드 형태로 표시하는 컴포넌트입니다.
 * 데스크톱과 모바일에서 다른 레이아웃으로 표시됩니다.
 * 검색어 하이라이트 기능을 지원합니다.
 */
function NewsCard({ news, fallbackSrc = '/default-thumbnail.png' }: NewsCardProps) {
  // 반응형 처리: useResponsive 훅으로 화면 크기 분기점 관리
  const { isDesktop } = useResponsive();

  /**
   * 검색어 highlight를 위해 텍스트를 sanitize 하고, em 태그를 허용합니다.
   */
  const safeTitle = DOMPurify.sanitize(news.title, {
    ALLOWED_TAGS: ['em', 'strong', 'u'],
    ALLOWED_ATTR: [],
  });
  const safeContent = DOMPurify.sanitize(news.summary ?? '', {
    ALLOWED_TAGS: ['em', 'strong', 'u'],
    ALLOWED_ATTR: [],
  });
  if (isDesktop) {
    return (
      <article className='flex-col overflow-hidden rounded-2xl border-grey-20 bg-white shadow-sm transition hover:shadow-lg'>
        <a href={news.link} target='_blank' rel='noopener noreferrer' className='block'>
          <div className='aspect-[16/9] w-full overflow-hidden bg-gray-100'>
            <img
              src={news.imageUrl?.trim() || fallbackSrc}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackSrc;
              }}
              alt={news.title}
              className='h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]'
              loading='lazy'
              sizes='(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw'
            />
          </div>
          <div className='flex flex-col gap-2 p-4'>
            <div className='flex items-center gap-4'>
              <p className='text-caption02'> {NewsCategoryLabel[news.category]}</p>
              <time className='text-gray-500'>{formatToLocalDate(news.date)}</time>
            </div>
            <p
              className='line-clamp-2 search-result__highlight text-title02'
              dangerouslySetInnerHTML={{ __html: safeTitle }}
            />
            <p
              className='text-grey-40 line-clamp-2 md:line-clamp-3 text-body03 search-result__highlight'
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
          </div>
        </a>
      </article>
    );
  }
  if (!isDesktop) {
    return (
      <article>
        <a href={news.link} target='_blank' rel='noopener noreferrer' className='flex gap-4 px-2.5'>
          <img
            src={news.imageUrl?.trim() || fallbackSrc}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackSrc;
            }}
            alt={news.title}
            loading='lazy'
            className='min-w-28 max-w-28 h-24 border border-grey-10 rounded object-cover'
            sizes='(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw'
          />

          <div className='w-full h-24'>
            <p
              className='line-clamp-1 search-result__highlight text-body04'
              dangerouslySetInnerHTML={{ __html: safeTitle }}
            />
            <p
              className='text-grey-40 line-clamp-2 md:line-clamp-3 text-caption02'
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />
            <p className='text-grey-20 text-caption04 line-clamp-2 md:line-clamp-3'>
              {news.reporter}
            </p>
            <time className='text-grey-10 text-caption05'>{formatToLocalDate(news.date)}</time>
          </div>
        </a>
      </article>
    );
  }
}

export default NewsCard;
