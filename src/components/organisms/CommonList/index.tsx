import DetailItem, { type ListItemProps } from '../DetailItem/idex';

interface NoticeListProps {
  items: ListItemProps[];
  category: 'notice' | 'news';
  page?: number;
  itemsPerPage?: number;
}

const CommonList: React.FC<NoticeListProps> = ({ items, category, page = 1, itemsPerPage = 8 }) => {
  return (
    <section className='flex flex-col'>
      {items.map((item, index) => (
        <DetailItem
          key={item.id}
          {...item}
          id={(page - 1) * itemsPerPage + index + 1}
          variant={category}
        />
      ))}
    </section>
  );
};

export default CommonList;
