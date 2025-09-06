import { useCallback, useEffect, useRef } from 'react';
import { gtmPush } from '../../utils/gtm';

type DoneState = null | 'success';

export function useRegisterTracking(options?: { method?: string }) {
  const startedRef = useRef(false);
  const doneRef = useRef<DoneState>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const pagePath = location.pathname + location.search;
  const method = options?.method ?? 'email';

  // 최초 진입
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;

    const onFirstInteract = () => {
      if (!startedRef.current) {
        startedRef.current = true;
        gtmPush({ event: 'sign_up_start', page_path: pagePath });
      }
    };

    el.addEventListener('input', onFirstInteract, { once: true, passive: true });
    el.addEventListener('change', onFirstInteract, { once: true, passive: true });

    return () => {
      el.removeEventListener('input', onFirstInteract);
      el.removeEventListener('change', onFirstInteract);
    };
  }, [pagePath]);

  // 제출 직전
  const onSubmitCapture: React.FormEventHandler<HTMLFormElement> = () => {
    gtmPush({ event: 'sign_up_submit', page_path: pagePath });
  };

  // 성공 마킹
  const markSuccess = useCallback(() => {
    doneRef.current = 'success';
    gtmPush({ event: 'sign_up', method });
  }, [method]);

  // 이탈 시 중도 포기
  useEffect(() => {
    return () => {
      if (doneRef.current === null) {
        gtmPush({ event: 'sign_up_abort', page_path: pagePath });
      }
    };
  }, [pagePath]);

  return { formRef, onSubmitCapture, markSuccess };
}
