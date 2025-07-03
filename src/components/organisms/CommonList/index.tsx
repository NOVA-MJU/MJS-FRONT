import React from 'react';
import DetailItem, { type ListItemProps } from '../DetailItem/idex';

interface NoticeListProps {
  items: ListItemProps[];
  category: string;
}

const CommonList: React.FC<NoticeListProps> = ({ items, category }) => {
  return (
    <section className='flex flex-col'>
      {items.map((item) => (
        <DetailItem
          key={item.id}
          id={item.id}
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
