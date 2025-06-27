import Badge from '../../atoms/Badge';

export interface NoticeItemProps {
  id: number;
  category: string;
  title: string;
  content: string;
  date: string;
  link: string;
}
const NoticeItem: React.FC<NoticeItemProps> = ({ id, category, title, content, date, link }) => (
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

export default NoticeItem;
