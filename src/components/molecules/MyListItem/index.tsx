import { Link } from 'react-router-dom';
import { Typography } from '../../atoms/Typography';
import { IoIosChatbubbles, IoIosHeart } from 'react-icons/io';
import { RxDividerVertical } from 'react-icons/rx';
import Divider from '../../atoms/Divider';

export interface MyListItemProps {
  id: string;
  title: string;
  contentPreview: string;
  commentCount: number;
  likeCount: number;
  publishedDate: string;
  commentPreview?: string;
  isLast?: boolean;
}

const MyListItem = ({
  id,
  title,
  contentPreview,
  commentCount,
  likeCount,
  publishedDate,
  commentPreview,
  isLast = false,
}: MyListItemProps) => {
  return (
    <>
      <Link to={`/board/${id}`} className='w-full h-fit flex flex-col md:gap-3'>
        <div className='w-full h-fit p-2 md:p-3 flex items-center gap-3 md:gap-6'>
          <div className='flex-1 h-fit flex flex-col gap-3'>
            <Typography variant='body02'>{title}</Typography>
            <Typography variant='body03' className='line-clamp-1 md:line-clamp-2'>
              {contentPreview}
            </Typography>
            <div className='flex gap2'>
              <Typography variant='body03' className='text-grey-40 flex gap-1 items-center'>
                <IoIosHeart />
                {likeCount}
                <RxDividerVertical />
                <IoIosChatbubbles />
                {commentCount}
              </Typography>
            </div>
          </div>
          <div className='w-fit h-fit px-3 flex items-center'>
            <Typography variant='body03' className='text-grey-40'>
              {publishedDate}
            </Typography>
          </div>
        </div>
        {commentPreview && (
          <div className='w-full h-fit p-2 md:p-3'>
            <div className='w-full h-fit flex flex-col gap-3 pl-6 border-l-2 border-blue-10 '>
              <span className='w-fit px-2 py-1 rounded-sm bg-blue-05'>
                <Typography variant='body02' className='text-blue-35'>
                  나의 댓글
                </Typography>
              </span>
              <Typography variant='body03'>{commentPreview}</Typography>
            </div>
          </div>
        )}
      </Link>
      {!isLast && <Divider variant='thin' />}
    </>
  );
};

export default MyListItem;
