/** @jsxImportSource @emotion/react */
import Button from '@/components/Button'
import { css } from '@emotion/react'


export default function DebugPage() {

  return (
    <div css={container}>
      <div css={componentView}>
        {/* 원하는 Component를 넣고 테스트 해보세요 */}

        <Button variant='primary' css={css`font-size: 2rem;`}>
          DEBUG - Primary
        </Button>

        <h1 />

        <Button variant='outline'>
          DEBUG - Outline
        </Button>

        {/* -------------- >8 -------------- */}
      </div>
    </div>
  )
}

const container = css`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const componentView = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
