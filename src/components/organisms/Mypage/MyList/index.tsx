import MyListItem, { type MyListItemProps } from '../../../molecules/MyListItem';

interface MyListProps {
  items: MyListItemProps[];
  isComment: boolean;
  page?: number;
  itemsPerPage: number;
}

const MyList = ({ items, isComment, page = 1, itemsPerPage }: MyListProps) => {
  return (
    <section className='w-full flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden'>
      {items.map((item, index) => (
        <div key={index}>
          <MyListItem
            key={item.id}
            {...item}
            id={(page - 1) * itemsPerPage + index + 1}
            variant={isComment ? 'comment' : 'default'}
            isLast={index === items.length - 1}
          />
          {index !== items.length - 1 && <div className='border-b border-gray-200' />}
        </div>
      ))}
    </section>
  );
};

export default MyList;
