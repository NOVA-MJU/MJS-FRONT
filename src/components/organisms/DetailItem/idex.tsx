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
  //variant가 없으면 date 유무로 판단
  const layout: 'notice' | 'news' = variant ?? (date ? 'notice' : 'news');

  /* --- 명대신문 --- */
  if (layout === 'news') {
    return (
      <>
        <a
          href={link}
          target='_blank'
          rel='noopener noreferrer'
          className='flex gap-8 py-6 cursor-pointer'
        >
          {imgSrc && (
            <img
              src={imgSrc}
              alt='image'
              className='min-w-[120px] h-[90px] object-cover rounded-md'
            />
          )}

          <div className='flex flex-col gap-2'>
            <p className='text-base font-medium line-clamp-1'>{title}</p>
            <p className='text-base font-light line-clamp-2'>{content}</p>
          </div>
        </a>
        <hr className='border-grey-20' />
      </>
    );
  }

  /* --- 공지사항 --- */
  return (
    <>
      <div className='flex justify-between items-center gap-2 py-6'>
        <div>
          <span className='w-[98px] flex items-center mb-6'>
            <p className='font-light mr-4'>{id}</p>
            <Badge text={category} />
          </span>
          <a
            href={link} //api 연결 후 링크 연결 예정
            target='_blank'
            rel='noopener noreferrer'
            className='flex flex-col gap-2 cursor-pointer'
          >
            <p className='text-base font-medium'>{title}</p>
            <p className='text-base font-light'>{content}</p>
          </a>
        </div>
        <p className='text-sm text-grey-40 flex'>{date}</p>
      </div>
      <hr className='border-grey-20' />
    </>
  );
};

export default DetailItem;
