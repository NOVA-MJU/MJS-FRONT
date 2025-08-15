import { Typography } from '../../../../components/atoms/Typography';
import { useNavigate, useParams } from 'react-router-dom';
import Divider from '../../../../components/atoms/Divider';
import NavigationUp from '../../../../components/molecules/NavigationUp';
import { useEffect, useState } from 'react';
import { deleteDepartmentNotice, getDepartmentNoticeDetail } from '../../../../api/admin';
import { formatToElapsedTime, formatToLocalTime } from '../../../../utils';
import BlockTextEditor from '../../../../components/organisms/BlockTextEditor';
import GlobalErrorPage from '../../../error';

export default function AdminNoticeDetail() {
  const { departmentUuid, noticeUuid } = useParams<{
    departmentUuid: string;
    noticeUuid: string;
  }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [localDate, setLocalDate] = useState('');
  const [elapsedDate, setElapsedDate] = useState('');
  const [content, setContent] = useState('');
  const [isError, setIsError] = useState(false);

  /**
   * 페이지 로드 요청
   */
  useEffect(() => {
    (async () => {
      if (!departmentUuid || !noticeUuid) return;
      try {
        const res = await getDepartmentNoticeDetail(departmentUuid, noticeUuid);
        setTitle(res.title);
        setContent(res.content);
        setLocalDate(formatToLocalTime(res.createAt));
        setElapsedDate(formatToElapsedTime(res.createAt));
      } catch (e) {
        console.error(e);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [departmentUuid, noticeUuid]);

  /**
   * 공지사항 수정 버튼 클릭 핸들러
   */
  const handleEditNotice = () => {
    navigate(`/admin/${departmentUuid}/notice/edit/${noticeUuid}`, { state: { from: 'detail' } });
  };

  /**
   * 공지사항 삭제 버튼 클릭 핸들러
   */
  const handleDeleteNotice = async () => {
    if (!departmentUuid || !noticeUuid || isLoading) return;
    if (!window.confirm('공지사항을 삭제하시겠습니까?')) return;
    setIsLoading(true);
    try {
      await deleteDepartmentNotice(departmentUuid, noticeUuid);
      alert('공지사항이 삭제되었습니다.');
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isError) return <GlobalErrorPage />;

  return (
    <div className='w-full flex-1 px-7 py-12 flex flex-col gap-6'>
      <div className='w-full flex justify-between items-center'>
        <NavigationUp onClick={() => navigate(-1)} />
        <div className='flex gap-3'>
          <button
            className='w-46 h-12 p-3 cursor-pointer bg-grey-10 rounded-xl'
            onClick={handleEditNotice}
          >
            <Typography variant='body02'>수정</Typography>
          </button>
          <button
            className='w-46 h-12 p-3 cursor-pointer bg-error rounded-xl'
            onClick={handleDeleteNotice}
          >
            <Typography variant='body02' className='text-white'>
              삭제
            </Typography>
          </button>
        </div>
      </div>
      <div className='flex justify-between p-3 gap-3 items-center'>
        <Typography variant='heading02'>{title}</Typography>
        <Typography variant='body03' className='text-grey-40'>
          {`${localDate} | ${elapsedDate}`}
        </Typography>
      </div>
      <Divider variant='thin' />
      <BlockTextEditor readOnly initialContent={content} />
    </div>
  );
}
