/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MarkdownViewer from "@components/MarkdownViewer";
import { deleteBoardContent, getBoardContent, postBoardLike } from '@api/boardApi';
import { LuHeart, LuMessageSquare } from "react-icons/lu";
import Comment from '@components/Comment';
import LoadingComponent from '@components/util/LoadingComponent';
import { toast } from 'react-toastify';
import Avatar from '@components/Avatar';
import Button from '@/components/Button';
import { getTimeElapsed } from '@/util/getTimeElapsed';

const BoardDetailPage = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const [content, setContent] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const iconSize = 16;

  const handleDeletePost = async () => {
    if (loading) {
      toast.error('잠시 기다려주세요')
      return
    }

    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      setLoading(true)
      try {
        const response = await deleteBoardContent(uuid)
        navigate('/board')
        toast.info('게시글이 삭제되었습니다')
      } catch (e) {
        console.error(e)
        toast.error(e.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmitLike = async () => {
    if (loading) {
      toast.error('잠시 기다려주세요')
      return
    }

    try {
      setLoading(true)
      const response = await postBoardLike(uuid)
      toast.info(response.data)
    } catch (e) {
      console.error(e)
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getData = async () => {
      setPageLoading(true);
      try {
        const response = await getBoardContent(uuid);
        // console.log(response.data)
        setContent(response.data);
      } catch (error) {
        toast.error(error.message)
      } finally {
        setPageLoading(false);
      }
    }
    getData();
  }, [uuid])

  if (pageLoading) {
    return (
      <div css={pageStyle}>
        <div css={errorStyle}>
          <LoadingComponent message='게시글을 불러오는 중입니다' />
        </div>
      </div>
    )
  } else if (content) {
    return (
      <div css={pageStyle}>
        <div css={css`display: flex; flex-direction: column;`}>
          <div css={css`display:flex; justify-content: space-between; border-bottom: 1px solid #ccc; padding-bottom: 0.75rem;`}>
            <div>
              <span css={css`font-size: 1.5em; font-weight: bold; margin: 8px; flex: 1;`}>
                {content.title}
              </span>
            </div>
            <div css={css`display: flex; flex-direction: row; gap: 8px;`}>
              <Button variant='outline' css={css`color: grey;`}>
                수정
              </Button>
              <Button variant='outline' css={css`color: grey;`} onClick={handleDeletePost}>
                삭제
              </Button>
            </div>
          </div>
          <div css={css`margin: 8px; display: flex; justify-content: flex-end; gap: 20px;`}>
            <span css={css`display: flex; align-items: center; gap: 8px; color: #D00392;`}>
              <LuHeart size={iconSize} />
              {content.likeCount === undefined ? "null" : content.likeCount}
            </span>
            <span css={css`display: flex; align-items: center; gap: 8px; color: #0386D0;`}>
              <LuMessageSquare size={iconSize} />
              {content.commentCount}
            </span>
          </div>
        </div>
        <div css={css`padding: 16px;`}>
          <MarkdownViewer>
            {content.content}
          </MarkdownViewer>
        </div>
        <div css={css`width: 100%;`}>
          <div css={css`
            padding: 16px; 
            display: flex; 
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ccc;`}>
            <div css={css`display: flex; gap: 16px; align-items: center;`}>
              <Avatar size={48} />
              <div css={css`display: flex; flex-direction: column; gap: 4px;`}>
                <span css={css`font-size: 18px; font-weight: 700;`}>
                  {content.author}
                </span>
                <span>
                  {getTimeElapsed(content.publishedAt)}
                </span>
              </div>
            </div>
            <button
              css={css`
                background-color: #D00392;
                color: white;
                text-align: center;
                border-radius: 10px;
                border: none;
                padding: 10px 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px; `}
              onClick={handleSubmitLike}>
              <LuHeart />
              좋아요
            </button>
          </div>
          <Comment uuid={uuid} />
        </div>
      </div >
    );
  } else {
    return (
      <div css={pageStyle}>
        <div css={errorStyle}>
          <h1>게시글을 찾을 수 없습니다.</h1>
          <button css={backButtonStyle} onClick={() => navigate('/board')}>
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }
};

export default BoardDetailPage;

const pageStyle = css`
  width: 100%;
  height: 100%;
  padding: 3%;
  gap: 40px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 16px;
`;

const errorStyle = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const backButtonStyle = css`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #001f5c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #003cb3;
  }
`;
