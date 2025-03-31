/** @jsxImportSource @emotion/react */
import { getUserInfo } from '@/api/userApi'
import LoadingComponent from '@/components/util/LoadingComponent'
import { useAuth } from '@/context/AuthContext'
import Avatar from '@components/Avatar'
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


export default function ProfilePage() {
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true)

      try {
        const response = await getUserInfo()
        setUserInfo(response.data)
        console.log(response.data)
      } catch (e) {
        if (e.status == 403) {
          toast.warn('로그인이 필요한 서비스입니다')
          navigate('/main')
        } else {
          setIsError(true)
          toast.error(e.message)
        }
      } finally {
        setIsLoading(false)
      }
    }
    getData()
  }, [])

  if (isLoading) {
    return (
      <div css={pageLayout}>
        <div css={containerLayout}>
          <div css={boxLayout}>
            <LoadingComponent message='사용자 정보를 불러오는 중' />
          </div>
        </div>
      </div>
    )
  } else {
    if (isError) {
      <div css={pageLayout}>
        <div css={containerLayout}>
          <div css={boxLayout}>
            <h1>
              문제가 발생했습니다
            </h1>
            <Link to={'/main'}>
              <button>
                <h3>
                  돌아가기
                </h3>
              </button>
            </Link>
          </div>
        </div>
      </div>
    } else {
      return (
        <div css={pageLayout}>
          <div css={containerLayout}>
            <div css={boxLayout}>
              <div css={css`width: 100%; display: flex; justify-content: space-between;`}>
                <span css={headingStyle}>
                  내 프로필
                </span>
                <Link to={`/profile/edit`} css={linkStyle} style={{ color: '#999999' }}>
                  <span>
                    편집
                  </span>
                </Link>
              </div>
              <div css={css`width: 100%; padding: 0.5rem; display: flex; gap: 1rem;`}>
                <Avatar size={64} />
                <div css={css`flex: 1; display: flex; flex-direction: column; gap: 0.5rem;`}>
                  <span css={css`font-weight: 600;`}>
                    {userInfo.nickname}
                  </span>
                  <span css={css`font-size: 0.875rem; font-weight: 300;`}>
                    {userInfo.email}
                  </span>
                  <span css={css`font-size: 0.875rem; font-weight: 300; color: #999999;`}>
                    {userInfo.department || '학과정보가없습니다'} | {userInfo.studentNumber || '학번정보가없습니다'} | 재학생
                  </span>
                </div>
              </div>
            </div>
            <div css={boxLayout}>
              <div css={css`display: flex; gap: 2rem;`}>
                <span css={headingStyle}>
                  내 활동
                </span>
                <span css={css`color: #999999;`}>
                  작성한 게시물 13개, 댓글 244개
                </span>
              </div>
              <div css={css`display: flex; flex-direction: column; gap: 1.5rem; padding: 0.25rem;`}>
                <Link css={linkStyle} to={'activity/board'}>
                  <span>게시물</span>
                </Link>
                <Link css={linkStyle} to={'activity/like'}>
                  <span>좋아요 누른 게시물</span>
                </Link>
                <Link css={linkStyle} to={'activity/comment'}>
                  <span>댓글 작성한 게시글</span>
                </Link>
              </div>
            </div>
            <div css={boxLayout}>
              <span css={headingStyle}>
                회원 정보 수정
              </span>
              <Link css={linkStyle}>
                <span>
                  비밀번호 변경
                </span>
              </Link>
              <Link css={linkStyle}>
                <span>
                  닉네임 설정
                </span>
              </Link>
              <Link css={linkStyle}>
                <span>
                  학과 설정
                </span>
              </Link>
              <Link css={linkStyle}>
                <span>
                  학적 처리 내역
                </span>
              </Link>
              <Link css={linkStyle}>
                <span>
                  이용 제한 내역
                </span>
              </Link>
            </div>
            <div css={boxLayout}>
              <span css={headingStyle}>
                이용안내
              </span>
              <div css={css`display: flex; flex-direction: column; gap: 1.5rem; padding: 0.25rem;`}>
                <Link css={linkStyle}>
                  <span>공지사항</span>
                </Link>
                <Link css={linkStyle}>
                  <span>자주찾는 질문</span>
                </Link>
                <Link css={linkStyle} to={'/profile/inquery'}>
                  <span>문의하기</span>
                </Link>
                <Link css={linkStyle}>
                  <span>서비스 이용약관</span>
                </Link>
                <Link css={linkStyle}>
                  <span>개인정보 처리방침</span>
                </Link>
                <Link css={linkStyle}>
                  <span>이용 제한 내역</span>
                </Link>
              </div>
            </div>
            <div css={css`width: 100%; display:flex; justify-content: flex-end;`}>
              <Link to={'/profile/withdrawal'} css={css`font-size: 0.75rem; color: #999; text-decoration: none;`}>
                <span>
                  회원 탈퇴
                </span>
              </Link>
            </div>
          </div>
        </div >
      )
    }
  }
}

const pageLayout = css`
  width: 100%;
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const containerLayout = css`
  width: 600px; 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  align-items: center;
  gap: 2rem;
`

const boxLayout = css`
  width: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1.75rem;
`

const headingStyle = css`
  color: #012968; 
  font-size: 1.25rem; 
  font-weight: bold;
`

const linkStyle = css`
  color: inherit; 
  text-decoration: none; 
  font-size: 1.125rem; 
  font-weight: 400; 
  
  &:hover {
    text-decoration: underline;
  }
`
