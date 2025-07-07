import React from 'react';
import DetailItem, { type ListItemProps } from '../DetailItem/idex';

interface NoticeListProps {
  items: ListItemProps[];
  category: string;
  page?: number;
  itemsPerPage?: number;
}

const CommonList: React.FC<NoticeListProps> = ({ items, category, page = 1, itemsPerPage = 8 }) => {
  return (
    <section className='flex flex-col'>
      {items.map((item, index) => (
        <DetailItem
          key={item.id}
          id={(page - 1) * itemsPerPage + index + 1}
          category={item.category}
          title={item.title}
          content={item.content}
          date={item.date}
          link={item.link}
          imgSrc={item.imgSrc}
          variant={category as 'notice' | 'news'}
        />
      ))}
    </section>
  );
};

export default CommonList;
