import { useState } from 'react';
import Pagination from '../../molecules/common/Pagination';
import DepartmentNoticeItem from '../../molecules/DepartmentNoticeItem';
import { Typography } from '../../atoms/Typography';

interface DepartmentNoticeBoardProps {
  items: DepartmentNoticeBoardItem[] | null;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface DepartmentNoticeBoardItem {
  uuid: string;
  imageUrl: string;
  title: string;
  content: string;
  date: string;
}

export default function DepartmentNoticeBoard({
  items,
  totalPages,
  onPageChange,
}: DepartmentNoticeBoardProps) {
  const [page, setPage] = useState(0);

  return (
    <div className='w-full h-fit flex flex-col gap-3'>
      {items ? (
        <>
          {items.map((item) => (
            <DepartmentNoticeItem
              key={item.uuid}
              imageUrl={item.imageUrl}
              title={item.title}
              content={item.content}
              date={item.date}
            />
          ))}
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(next) => {
              setPage(next);
              onPageChange(next);
            }}
          />
        </>
      ) : (
        <div className='min-h-10 flex justify-center items-center'>
          <Typography variant='heading01' className='text-black'>
            아직 등록된 공지 사항이 없습니다
          </Typography>
        </div>
      )}
    </div>
  );
}
