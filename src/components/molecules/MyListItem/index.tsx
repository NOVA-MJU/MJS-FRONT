import { Link } from 'react-router-dom';
import { IoIosHeartEmpty } from 'react-icons/io';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
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
    <div className='hover:bg-blue-05 active:bg-blue-05'>
      <Link to={`/board/${id}`} className='flex h-fit w-full flex-col md:gap-3'>
        <div className='flex h-fit w-full items-center p-2 not-hover:transition md:gap-6 md:p-3'>
          <div className='flex h-fit flex-1 flex-col gap-3'>
            <p className='text-body02 font-semibold'>{title}</p>
            <p className='text-body05 line-clamp-1 md:line-clamp-2'>{contentPreview}</p>
            <div className='flex justify-between gap-2'>
              <div>
                <p className='text-grey-40 text-caption02 flex items-center gap-1'>
                  <IoIosHeartEmpty className='text-blue-10' />
                  {likeCount}
                  <RxDividerVertical />
                  <IoChatbubbleEllipsesOutline className='text-blue-10' />
                  {commentCount}
                </p>
              </div>
              <div className='flex h-fit w-fit items-center px-3'>
                <p className='text-grey-40 text-caption02'>{publishedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {commentPreview && (
          <div className='h-fit w-full px-2 pb-2 md:px-3 md:pb-3'>
            <div className='border-blue-10 flex h-fit w-full flex-col gap-3 border-l-2 pl-6'>
              <span className='bg-blue-05 w-fit rounded-sm px-2 py-1'>
                <p className='text-blue-35 text-body02'>나의 댓글</p>
              </span>
              <p className='text-body03'>{commentPreview}</p>
            </div>
          </div>
        )}
      </Link>

      {!isLast && <Divider variant='thin' />}
    </div>
  );
};

export default MyListItem;
