'use client';

import { useEffect, useState } from 'react';
import { getBoards } from '../../../../api/board';
import type { BoardItem } from '../../../../api/board';
import { useAuthStore } from '../../../../store/useAuthStore';
import { FaRegThumbsUp, FaRegCommentDots } from 'react-icons/fa';

type Status = 'loading' | 'success' | 'error';

interface Props {
  limit?: number;
  hrefBuilder?: (uuid: string) => string;
  loginHref?: string;
  onLoginClick?: () => void;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function extractBoards(res: unknown): BoardItem[] {
  if (Array.isArray(res)) return res as BoardItem[];
  if (isObject(res)) {
    const contentDirect = (res as Record<string, unknown>)['content'];
    if (Array.isArray(contentDirect)) return contentDirect as BoardItem[];
    const data = (res as Record<string, unknown>)['data'];
    if (isObject(data)) {
      const contentInData = (data as Record<string, unknown>)['content'];
      if (Array.isArray(contentInData)) return contentInData as BoardItem[];
    }
  }
  return [];
}

function getErrorMessage(e: unknown): string {
  return e instanceof Error ? e.message : '자유게시판 HOT 목록을 불러오지 못했어요.';
}

export default function HotBoardList({
  limit = 5,
  hrefBuilder = (uuid) => `/boards/${uuid}`,
  loginHref = '/login',
  onLoginClick,
}: Props) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<BoardItem[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let mounted = true;

    if (!isLoggedIn) {
      setStatus('success');
      setItems([]);
      setErrorMsg('');
      return () => {
        mounted = false;
      };
    }

    (async () => {
      try {
        setStatus('loading');
        setErrorMsg('');

        const res = await getBoards(0, 20, 'likeCount', 'DESC');
        const rows = extractBoards(res);
        const hot = rows.filter((r) => r.popular === true).slice(0, limit);

        if (!mounted) return;
        setItems(hot);
        setStatus('success');
      } catch (e: unknown) {
        if (!mounted) return;
        setStatus('error');
        setErrorMsg(getErrorMessage(e));
      }
    })();

    return () => {
      mounted = false;
    };
  }, [limit, isLoggedIn]);

  return (
    <section
      className='rounded-2xl border border-blue-05 bg-white shadow-sm px-5 py-5'
      aria-label='자유게시판 HOT'
    >
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-base font-semibold text-mju-primary'>HOT 게시물</h3>
        <a
          href={isLoggedIn ? '/boards' : loginHref}
          onClick={!isLoggedIn ? onLoginClick : undefined}
          className={`text-xs no-underline ${isLoggedIn ? 'text-mju-primary hover:opacity-80' : 'text-gray-400 hover:text-grey-40'}`}
        >
          더보기
        </a>
      </div>

      {/* 로그인 전 뷰 */}
      {!isLoggedIn && (
        <div className='text-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-sm'>
          <p className='text-grey-40 font-bold'>로그인이 필요한 서비스입니다.</p>
          <div className='mt-3'>
            <a
              href={loginHref}
              onClick={onLoginClick}
              className='inline-flex items-center rounded-md bg-mju-primary px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 no-underline'
            >
              로그인하러 가기
            </a>
          </div>
        </div>
      )}

      {/* 로그인 후 뷰 */}
      {isLoggedIn && (
        <>
          {status === 'loading' && (
            <ul className='space-y-2'>
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className='h-10 rounded-lg bg-gray-100 animate-pulse' />
              ))}
            </ul>
          )}

          {status === 'error' && <div className='text-sm text-red-600 py-4'>{errorMsg}</div>}

          {status === 'success' && (
            <>
              {items.length === 0 ? (
                <div className='text-sm text-gray-500 py-4'>HOT 게시물이 없습니다.</div>
              ) : (
                // 랭킹 스타일 리스트
                <ol className='space-y-4'>
                  {items.map((post, idx) => {
                    const rank = idx + 1;
                    const rankColor = rank <= 3 ? 'text-sky-600' : 'text-gray-400';
                    return (
                      <li key={post.uuid} className='flex items-center gap-4'>
                        {/* 좌측 순위 번호 */}
                        <span className={`w-6 text-right font-semibold ${rankColor}`}>{rank}</span>

                        {/* 항목 (밑줄 제거) */}
                        <a
                          href={hrefBuilder(post.uuid)}
                          className='group flex flex-1 items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 no-underline'
                        >
                          <span className='flex-1 text-sm text-gray-900 truncate no-underline'>
                            {post.title}
                          </span>

                          <span className='text-xs text-gray-400 shrink-0 inline-flex items-center gap-3'>
                            <span className='inline-flex items-center gap-1'>
                              <FaRegThumbsUp aria-label='좋아요' />
                              {post.likeCount}
                            </span>
                            <span className='inline-flex items-center gap-1'>
                              <FaRegCommentDots aria-label='댓글' />
                              {post.commentCount}
                            </span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
