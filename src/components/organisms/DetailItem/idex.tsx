import Badge from '../../atoms/Badge';

export interface ListItemProps {
  id: number;
  category: string;
  title: string;
  content: string;
  date?: string;
  link: string;
  imgSrc?: string;
  variant?: 'notice' | 'news';
}

const categoryLabel: Record<string, string> = {
  general: '일반공지',
  academic: '학사공지',
  scholarship: '장학공지',
  career: '진로공지',
  activity: '학생활동',
  rule: '학칙개정',
};

const DetailItem: React.FC<ListItemProps> = ({
  id,
  category,
  title,
  content,
  date,
  link,
  imgSrc,
  variant,
}) => {
  /* --- variant가 없으면 date 유무로 판단 --- */
  const layout: 'notice' | 'news' = variant ?? (date ? 'notice' : 'news');

  /* --- 명대신문 --- */
  if (layout === 'news') {
    return (
      <div>
        <a
          href={link}
          target='_blank'
          rel='noopener noreferrer'
          className='flex md:gap-4 py-6 cursor-pointer'
        >
          {imgSrc && (
            <img
              src={imgSrc || '/default-thumbnail.png'}
              alt={title}
              className='md:min-w-[152px] h-[114px] object-cover rounded-xl'
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/default-thumbnail.png';
              }}
            />
          )}

          <div className='flex flex-col gap-2'>
            <p className='text-base font-medium line-clamp-1'>{title}</p>
            <p className='text-base font-light line-clamp-2'>{content}</p>
          </div>
        </a>
        <hr className='border-grey-20' />
      </div>
    );
  }

  /* --- 공지사항 --- */
  return (
    <>
      <div className='flex justify-between items-center gap-2 py-6'>
        <div>
          <span className='md:w-[1000px] flex items-center mb-4 md:mb-6'>
            <p className='font-light mr-4'>{String(id).padStart(2, '0')}</p>
            <Badge text={layout === 'notice' ? categoryLabel[category] || category : category} />
          </span>
          <a
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            className='flex flex-col gap-2 cursor-pointer'
          >
            <p className='w-50 md:w-full text-sm md:text-base font-medium'>{title}</p>
          </a>
        </div>
        <p className='text-xs md:text-sm text-grey-40 flex'> {date?.split('T')[0]}</p>
      </div>
      <hr className='border-grey-20' />
    </>
  );
};

export default DetailItem;
