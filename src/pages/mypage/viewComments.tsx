import { useEffect, useState } from 'react';
import MyViewLayout from '../../components/templates/MyViewLayout';
import Demo from '../../constants/demo-comments';

interface CommentedPost {
  boardUuid: string;
  boardTitle: string;
  boardPreviewContent: string;
  commentUuid: string;
  commentPreviewContent: string;
}

const ViewComments: React.FC = () => {
  const ITEMS_PER_PAGE = 8;
  const [page, setPage] = useState(1);
  const [contentList, setContentList] = useState<CommentedPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    try {
      setLoading(true);
      // const data = await getMyComments(); // 실제 API 호출 시 사용
      const data = Demo.data;
      setContentList(data);
    } catch (err) {
      console.error('[mypage mock 오류]', err);
    } finally {
      setLoading(false);
    }
  };

  const paginatedItems = contentList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      {loading ? (
        <p className='text-center mt-20'>로딩 중...</p>
      ) : (
        <div>
          <MyViewLayout
            title='내가 쓴 댓글'
            itemsPerPage={ITEMS_PER_PAGE}
            page={page}
            onChange={setPage}
            totalPages={Math.ceil(contentList.length / ITEMS_PER_PAGE)}
            isComment={true}
            items={paginatedItems.map((item, index) => ({
              id: index + 1,
              title: item.boardTitle,
              content: item.commentPreviewContent,
              link: `/post/${item.boardUuid}`,
              isLast: index === paginatedItems.length - 1,
            }))}
          />
        </div>
      )}
    </>
  );
};

export default ViewComments;
