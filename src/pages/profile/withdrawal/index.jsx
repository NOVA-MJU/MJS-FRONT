/** @jsxImportSource @emotion/react */
import Button from '@/components/Button';
import { css } from '@emotion/react';
import { deleteUserAccount } from '@api/userApi';
import { useState } from 'react';
import { toast } from 'react-toastify';


export default function WithDrawalPage() {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteAccount = async () => {
    if (isLoading) {
      toast.error('잠시 기다려 주세요')
      return
    }
    setIsLoading(true)

    try {
      deleteUserAccount(password)
      toast.info('계정이 삭제되었습니다')
    } catch (e) {
      toast.error(e.message)
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div css={pageLayout}>
      <div css={containerLayout}>
        <div css={boxLayout}>
          <span css={headingStyle}>
            회원 탈퇴
          </span>
          <div css={css`display: flex; flex-direction: column; padding: 0 0.5rem; gap: 0.5rem;`}>
            <span css={css`font-size: 0.75rem; color: #999;`}>
              계정 비밀번호
            </span>
            <input
              css={css`padding: 0.375rem;`}
              type='password'
              placeholder='계정 비밀번호'
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <span css={css`font-size: 0.75rem; color: #999;`}>
            ‼️ 탈퇴 및 재가입을 반복할 경우, 서비스 악용 방지를 위해 재가입이 제한됩니다. 최초 탈퇴 시에는 가입 시점을 기준으로 1일간 제한되며, 2회 이상 탈퇴를 반복할 경우 30일간 제한됩니다.
          </span>
          <div css={css`display:flex; flex-direction: column; gap: 0.125rem;`}>
            <span css={css`font-size: 0.75rem; color: #999;`}>
              ‼️ 탈퇴 후 개인정보, 시간표 등의 데이터가 삭제되며, 복구할 수 없습니다.
            </span>
            <span css={css`font-size: 0.75rem; color: #999;`}>
              ‼️ 다시 가입하여도, 게시판 등 이용 제한 기록은 초기화되지 않습니다.
            </span>
            <span css={css`font-size: 0.75rem; color: #999;`}>
              ‼️ 작성한 게시물은 삭제되지 않으며, (알수없음)으로 닉네임이 표시됩니다.
            </span>
            <span css={css`font-size: 0.75rem; color: #999;`}>
              ‼️ 자세한 내용은 개인정보처리방침을 확인해주세요.
            </span>
          </div>
          <Button css={css`padding: 0.5rem;`} onClick={handleDeleteAccount}>
            탈퇴하기
          </Button>
        </div>
      </div>
    </div>
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

const linkStyle = css`
  color: inherit;
  text-decoration: none;
  font-size: 1.125rem;
  font-weight: 400;

  &:hover {
    text - decoration: underline;
  }
`
