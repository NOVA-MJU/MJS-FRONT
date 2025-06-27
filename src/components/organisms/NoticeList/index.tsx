import React from 'react';
import NoticeItem, { type NoticeItemProps } from '../../organisms/NoticeItem/idex';

interface NoticeListProps {
  items: NoticeItemProps[];
}

const NoticeList: React.FC<NoticeListProps> = ({ items }) => {
  return (
    <section className='flex flex-col'>
      {items.map((item) => (
        <NoticeItem
          key={item.id}
          id={item.id}
          category={item.category}
          title={item.title}
          content={item.content}
          date={item.date}
        />
      ))}
    </section>
  );
};

export default NoticeList;
