import { useState } from 'react';
import type { AxiosError } from 'axios';
import { sendEmailExists, sendAuthority, changePassword } from '../api/user';
import { toFullEmail } from '../utils/email';
import type { ApiResponse } from '../types/api';
import { normalizeCode } from '../utils/code';

/** 공통 에러 메시지 유틸 (Axios 4xx/5xx + 커스텀) */
const toErrMsg = (err: unknown, fallback: string) => {
  const ax = err as AxiosError<ApiResponse<unknown>>;
  console.error('[toErrMsg] 원본 에러:', err);
  return ax.response?.data?.message || ax.response?.data?.status || ax.message || fallback;
};

/** 1) 비밀번호 찾기 — 이메일로 인증코드 발송 */
export function useSendRecoveryEmail() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (email: string) => {
    setLoading(true);
    setError(null);
    setDone(false);

    try {
      const fullEmail = toFullEmail(email);
      console.log('[useSendRecoveryEmail] 요청 시작:', fullEmail);

      const ok = await sendEmailExists(fullEmail);
      console.log('[useSendRecoveryEmail] 응답(ok):', ok);

      setDone(ok);
      if (!ok) setError('인증 이메일 발송에 실패했습니다.');
    } catch (e) {
      console.error('[useSendRecoveryEmail] 에러 발생:', e);
      setDone(false);
      setError(toErrMsg(e, '인증 이메일 발송에 실패했습니다.'));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, done, error };
}

/** 2) 비밀번호 찾기 — 인증코드 검증(+ 내부 플래그 세팅) */
export function useVerifyRecoveryCode() {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = async (email: string, code: string) => {
    setLoading(true);
    setError(null);
    setVerified(false);

    try {
      const fullEmail = toFullEmail(email);
      const safeCode = normalizeCode(code);

      console.log('[useVerifyRecoveryCode] 요청 시작:', { fullEmail, safeCode });

      // 내부 플래그 세팅
      const ok = await sendAuthority(fullEmail, safeCode);
      console.log('[useVerifyRecoveryCode] /members/recovery/verify-code ok:', ok);
      setVerified(ok);
      if (!ok) {
        setError(
          '인증 처리에 실패했습니다. (코드 만료/최신 코드 아님/계정 미존재 가능) 다시 요청해 주세요.',
        );
      }
    } catch (e) {
      console.error('[useVerifyRecoveryCode] 에러 발생:', e);
      setVerified(false);
      setError(toErrMsg(e, '인증 처리에 실패했습니다.'));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { verify, loading, verified, error };
}

/** 3) 비밀번호 찾기 — 새 비밀번호로 재설정 */
export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = async (email: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    setOk(false);

    try {
      const fullEmail = toFullEmail(email);
      console.log('[useResetPassword] 요청 시작:', { fullEmail });

      const success = await changePassword(fullEmail, newPassword);
      console.log('[useResetPassword] 응답(success):', success);

      setOk(success);
      if (!success) setError('비밀번호 변경에 실패했습니다.');
    } catch (e) {
      console.error('[useResetPassword] 에러 발생:', e);
      setOk(false);
      setError(toErrMsg(e, '비밀번호 변경에 실패했습니다.'));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { reset, loading, ok, error };
}
