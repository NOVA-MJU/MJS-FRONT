/** @jsxImportSource @emotion/react */
import { getMyLikedPosts } from '@/api/userApi'
import Button from '@/components/Button'
import LoadingComponent from '@/components/util/LoadingComponent'
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { LuHeart, LuMessageSquare } from 'react-icons/lu'
import { Link, useNavigate } from 'react-router-dom'

export default function LikeActivityPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [contents, setContents] = useState(X.data)
  const navigate = useNavigate()

  useEffect(() => {
    async function getData() {
      setIsLoading(true)

      try {
        const response = await getMyLikedPosts()
        setContents(response.data)
        console.log(response.data)
        setIsLoading(false)
      } catch (e) {
        console.error(e)
      }
    }
    getData()
  }, [])

  console.log(contents)

  return (
    <div css={pageLayout}>
      <div css={containerLayout}>
        <div css={boxLayout}>
          <span css={headingStyle}>
            좋아요 누른 게시글
          </span>
          {isLoading ? (
            <div css={alertStyle}>
              <LoadingComponent message='게시글을 불러오는 중입니다' />
            </div>
          ) : (
            contents ? (
              <div css={listStyle}>
                {contents.map((content) => {
                  return (
                    <Link to={`/board/${content.uuid}`} css={css`text-decoration: none; color: inherit;`} key={content.uuid}>
                      <div css={itemStyle}>
                        <div css={css`flex: 1; display: flex; flex-direction: column; gap: 0.25rem;`}>
                          <span css={css`font-size: 1rem; font-weight: 600;`}>
                            {content.title}
                          </span>
                          <span css={css`font-size: 0.75rem; color: grey;`}>
                            {content.content.length > 50 ? content.content.substring(0, 50) + "..." : content.content}
                          </span>
                        </div>
                        <div css={css`font-size: 0.875rem; color: grey; display: flex; gap: 0.5rem; align-items: center;`}>
                          <span css={css`display: flex; align-items: center; gap: 0.25rem; `}>
                            <LuHeart />
                            {content.likeCount}
                          </span>
                          <span css={css`display: flex; align-items: center; gap: 0.25rem;`}>
                            <LuMessageSquare />
                            {content.commentCount}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div css={alertStyle}>
                <h1>
                  좋아요 누른 게시글이 없습니다
                </h1>
                <Link to={'/board'}>
                  <Button css={css`font-size: 1rem; padding: 0.5rem 1rem;`}>
                    게시글 구경하러 가기
                  </Button>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </div >
  )
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

const listStyle = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const itemStyle = css`
  display: flex;
  transition: box-shadow 0.3s ease;
  padding: 0.75rem;
  border-radius: 1rem;
  
  :hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`

const alertStyle = css`
  display: flex; 
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
  min-height: 600px;
`

const X = {
  "status": "API 요청 성공",
  "data": [
    {
      "uuid": "831619ee-7588-4a5a-82b4-148d3aeed319",
      "title": "자전거 타고 괌 가는 방법6",
      "content": "우선 비행기 타고 가야하는데, 아 근데 문제는 자전거가 너무 큼. 우선 이거 톱으로 짤라서 가져가야됨. 근데 또 비싸잖슴? 그니까 본드로 도착해서 붙이는거 잊지 말라고",
      "contentImages": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg"
      ],
      "viewCount": 0,
      "published": true,
      "publishedAt": "2025-03-09T01:16:45.919532",
      "createdAt": "2025-03-09T01:16:45.954082",
      "updatedAt": "2025-03-11T14:44:09.279164",
      "likeCount": 1,
      "author": "마루명치",
      "commentCount": 1
    },
    {
      "uuid": "0d2f0efe-5d52-45ef-9020-54c2a3297ae7",
      "title": "자전거 타고 괌 가는 방법6",
      "content": "우선 비행기 타고 가야하는데, 아 근데 문제는 자전거가 너무 큼. 우선 이거 톱으로 짤라서 가져가야됨. 근데 또 비싸잖슴? 그니까 본드로 도착해서 붙이는거 잊지 말라고",
      "contentImages": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg"
      ],
      "viewCount": 0,
      "published": true,
      "publishedAt": "2025-03-08T16:27:26.481788",
      "createdAt": "2025-03-08T16:27:26.500878",
      "updatedAt": "2025-03-11T14:44:37.714103",
      "likeCount": 1,
      "author": "마루명치",
      "commentCount": 0
    }
  ],
  "timestamp": "2025-03-17T15:21:27.186072"
}
