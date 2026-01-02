import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types/api';
import { toast } from 'react-hot-toast';

/**
 * 에러 처리 유틸리티 모듈
 *
 * 이 모듈은 애플리케이션 전반에서 일관된 에러 처리를 제공합니다.
 * Axios 에러, 일반 에러, 네트워크 에러 등을 통합적으로 처리합니다.
 *
 * @module utils/error
 */

/**
 * Axios 에러 응답의 구조를 나타내는 타입
 */
interface AxiosErrorResponse {
  message?: string;
  status?: string | number;
  error?: string;
}

/**
 * 에러 메시지를 추출하는 함수
 *
 * Axios 에러에서 우선순위에 따라 에러 메시지를 추출합니다:
 * 1. response.data.message (서버에서 제공한 메시지)
 * 2. response.data.status (상태 코드)
 * 3. error.message (에러 객체의 메시지)
 * 4. fallback (기본 메시지)
 *
 * @param error - 처리할 에러 객체 (unknown 타입)
 * @param fallback - 에러 메시지를 찾을 수 없을 때 사용할 기본 메시지
 * @returns 추출된 에러 메시지 문자열
 *
 * @example
 * ```typescript
 * try {
 *   await someApiCall();
 * } catch (error) {
 *   const message = extractErrorMessage(error, '알 수 없는 오류가 발생했습니다.');
 *   console.error(message);
 * }
 * ```
 */
export function extractErrorMessage(error: unknown, fallback: string): string {
  // AxiosError인 경우
  if (isAxiosError(error)) {
    const response = error.response;
    const data = response?.data as AxiosErrorResponse | undefined;

    // 서버 응답에서 메시지 추출
    if (data?.message) {
      return data.message;
    }

    // 상태 코드가 있는 경우
    if (data?.status) {
      return String(data.status);
    }

    // Axios 에러 메시지
    if (error.message) {
      return error.message;
    }
  }

  // 일반 Error 객체인 경우
  if (error instanceof Error) {
    return error.message;
  }

  // 문자열인 경우
  if (typeof error === 'string') {
    return error;
  }

  // 그 외의 경우 fallback 반환
  return fallback;
}

/**
 * 에러를 처리하고 사용자에게 알림을 표시하는 함수
 *
 * 이 함수는 다음 작업을 수행합니다:
 * 1. 에러 메시지 추출
 * 2. 개발 환경에서 콘솔에 에러 로깅
 * 3. Toast 알림으로 사용자에게 에러 표시
 *
 * @param error - 처리할 에러 객체
 * @param fallback - 기본 에러 메시지
 * @param options - 추가 옵션
 * @param options.logError - 콘솔에 에러를 로깅할지 여부 (기본값: true)
 * @param options.showToast - Toast 알림을 표시할지 여부 (기본값: true)
 *
 * @example
 * ```typescript
 * try {
 *   await registerUser(data);
 * } catch (error) {
 *   handleError(error, '회원가입에 실패했습니다.');
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Toast 없이 에러만 로깅
 * handleError(error, '에러 발생', { showToast: false });
 * ```
 */
export function handleError(
  error: unknown,
  fallback: string = '알 수 없는 오류가 발생했습니다.',
  options: { logError?: boolean; showToast?: boolean } = {},
): void {
  const { logError = true, showToast = true } = options;
  const message = extractErrorMessage(error, fallback);

  // 개발 환경에서만 로깅 (프로덕션에서는 제거되도록)
  if (logError && import.meta.env.DEV) {
    console.error('[Error Handler]', message, error);
  }

  // Toast 알림 표시
  if (showToast) {
    toast.error(message);
  }
}

/**
 * 에러 메시지만 추출하고 알림은 표시하지 않는 함수
 *
 * 상태 관리나 커스텀 UI에서 에러를 처리할 때 사용합니다.
 *
 * @param error - 처리할 에러 객체
 * @param fallback - 기본 에러 메시지
 * @returns 추출된 에러 메시지
 *
 * @example
 * ```typescript
 * const [error, setError] = useState<string | null>(null);
 *
 * try {
 *   await someApiCall();
 * } catch (err) {
 *   setError(getErrorMessage(err, '요청에 실패했습니다.'));
 * }
 * ```
 */
export function getErrorMessage(error: unknown, fallback: string = '알 수 없는 오류'): string {
  return extractErrorMessage(error, fallback);
}

/**
 * AxiosError인지 확인하는 타입 가드 함수
 *
 * @param error - 확인할 에러 객체
 * @returns AxiosError인지 여부
 */
function isAxiosError(error: unknown): error is AxiosError<ApiResponse<unknown>> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * 특정 HTTP 상태 코드에 대한 에러를 처리하는 함수
 *
 * 상태 코드에 따라 다른 메시지를 표시할 수 있습니다.
 *
 * @param error - 처리할 에러 객체
 * @param statusMessages - 상태 코드별 메시지 맵
 * @param fallback - 기본 에러 메시지
 *
 * @example
 * ```typescript
 * try {
 *   await login(credentials);
 * } catch (error) {
 *   handleErrorWithStatus(error, {
 *     401: '로그인 정보가 일치하지 않습니다.',
 *     403: '접근 권한이 없습니다.',
 *     500: '서버 오류가 발생했습니다.',
 *   }, '로그인에 실패했습니다.');
 * }
 * ```
 */
export function handleErrorWithStatus(
  error: unknown,
  statusMessages: Record<number, string>,
  fallback: string = '알 수 없는 오류가 발생했습니다.',
): void {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status && statusMessages[status]) {
      handleError(error, statusMessages[status]);
      return;
    }
  }

  handleError(error, fallback);
}
