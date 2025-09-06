import { useEffect, useRef } from 'react';
import type { FormEventHandler } from 'react';
import { gtmPush } from '../../utils/gtm';

type Options = {
  method?: string; // 'email' 등
};

export function useLoginTracking(opts: Options = { method: 'email' }) {
  const startedRef = useRef(false);
  const doneRef = useRef<null | 'success'>(null);

  const pagePath =
    typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/login';

  const markStart = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      gtmPush({ event: 'login_start', page_path: pagePath });
    }
  };

  const onSubmitCapture: FormEventHandler<HTMLFormElement> = () => {
    markStart();
    gtmPush({ event: 'login_submit', page_path: pagePath });
  };

  const markSuccess = () => {
    doneRef.current = 'success';
    gtmPush({ event: 'login', method: opts.method });
  };

  useEffect(() => {
    return () => {
      if (doneRef.current === null) {
        gtmPush({ event: 'login_abort', page_path: pagePath });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { markStart, onSubmitCapture, markSuccess };
}
