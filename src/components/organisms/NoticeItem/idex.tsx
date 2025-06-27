import Badge from '../../atoms/Badge';

export interface NoticeItemProps {
  id: number;
  category: string;
  title: string;
  content: string;
  date: string;
}
const NoticeItem: React.FC<NoticeItemProps> = ({ id, category, title, content, date }) => (
  <>
    <div className='flex justify-between items-center gap-2 py-6'>
      <div>
        <span className='w-[98px] flex items-center mb-6'>
          <p className='font-light mr-4'>{id}</p>
          <Badge text={category} />
        </span>
        <div className='flex flex-col gap-2 cursor-pointer'>
          <p className='text-base font-medium'>{title}</p>
          <p className='text-base font-light'>{content}</p>
        </div>
      </div>
      <p className='text-sm text-grey-40 flex'>{date}</p>
    </div>
    <hr className='border-grey-20' />
  </>
);

export default NoticeItem;
