export interface MyListItemProps {
  id: number;
  title: string;
  content: string;
  date?: string;
  link: string;
  variant?: 'default' | 'comment';
  isLast: boolean;
}

const MyListItem = ({ title, content, date, link, variant = 'default' }: MyListItemProps) => {
  return (
    <div className='w-full h-auto flex justify-between p-4'>
      <div className='flex flex-col'>
        <a href={link} className='flex flex-col gap-2'>
          <h3 className='font-semibold text-lg'>{title}</h3>
          <p className='text-sm text-black font-normal'>{content}</p>
        </a>
        <div className='flex gap-2 mt-2 text-grey-40'>
          <span>❤️ 00</span>
          <span>|</span>
          <span>💬 00</span>
        </div>

        {variant === 'comment' && (
          <div className='text-sm text-gray-800 mt-4'>
            <div className='border-l-2 border-blue-10 pl-4'>
              <div className='bg-blue-05 text-blue-35 font-semibold w-[76px] rounded text-center px-2 py-1 mb-2'>
                나의 댓글
              </div>
              <p>{content}</p>
            </div>
          </div>
        )}
      </div>

      <div className='flex items-center mr-4 text-grey-40'>{date || '0000.00.00'}</div>
    </div>
  );
};

export default MyListItem;
