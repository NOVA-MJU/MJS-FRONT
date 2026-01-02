import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import {
  checkEmailValidation,
  emailVerification,
  verifyEmailCode,
  checkNicknameValidation,
  checkStuCodeValidation,
  registerMember,
  uploadProfileImage,
} from '../api/user';
import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { MAX_FILE_SIZE_MB } from '../constants/maxFileSize';
import {
  EMAIL_DOMAIN,
  IMAGE_MAX_WIDTH_OR_HEIGHT,
  IMAGE_COMPRESSION_QUALITY,
} from '../constants/common';
import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';

import { gtmPush } from '../utils/gtm';

/**
 * 회원가입 관련 상태와 이벤트 핸들러를 제공하는 커스텀 훅
 *
 * 이 훅은 회원가입 시 필요한 api를 한 번에 처리합니다.
 * 이메일 인증, 닉네임/학번 중복 확인, 프로필 이미지 변환 및 압축,
 * 회원가입 요청 처리 로직을 포함합니다.
 * + 추가: GTM 추적을 추가했습니다. (시작/제출/성공/이탈)
 *
 * @example
 * const {
 *   handleSendCode,
 *   handleSubmit
 * } = useRegisterHandlers({ id, nickname, studentCode, profileImageFile, pw, name, gender, department });
 *
 * // 인증 메일 발송
 * await handleSendCode();
 *
 * // 회원가입 제출
 * await handleSubmit(e);
 */
export const useRegisterHandlers = ({
  id,
  nickname,
  studentCode,
  profileImageFile,
  pw,
  name,
  gender,
  department,
}: {
  id: string;
  nickname: string;
  studentCode: string;
  profileImageFile: File | null;
  pw: string;
  name: string;
  gender: string;
  department: string;
}) => {
  const fullEmail = `${id}${EMAIL_DOMAIN}`;
  const navigator = useNavigate();

  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isStuCodeChecked, setIsStuCodeChecked] = useState(false);

  // GTM 관련 refs
  const startedRef = useRef(false);
  const doneRef = useRef<null | 'success'>(null);
  const pagePath =
    typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/register';
  const method = 'email';

  // 첫 액션에서 1회만 액션 발생
  const ensureStarted = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      gtmPush({ event: 'sign_up_start', page_path: pagePath });
    }
  };

  const strictGuardRef = useRef(true);
  useEffect(() => {
    return () => {
      if (strictGuardRef.current) {
        strictGuardRef.current = false; // 개발 Strict Mode의 첫 cleanup 스킵
        return;
      }
      if (doneRef.current === null) {
        gtmPush({ event: 'sign_up_abort', page_path: pagePath });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 공통 에러 처리 */
  const handleError = (err: unknown, defaultMsg = '알 수 없는 오류') => {
    const axiosError = err as AxiosError<{ message: string }>;
    console.error(axiosError?.response?.data?.message || defaultMsg);
    toast.error(axiosError?.response?.data?.message || defaultMsg);
  };

  const handleSendCode = async () => {
    try {
      ensureStarted();
      await checkEmailValidation(fullEmail);
      setIsEmailChecked(true);
      setIsSending(true);
      await emailVerification(fullEmail);
      toast('인증 메일을 발송했습니다. 메일함을 확인하세요!');
      setShowCodeInput(true);
    } catch (err: unknown) {
      handleError(err, '이메일 중복 확인 또는 인증 메일 발송 실패');
      toast.error('이메일 중복 확인 또는 인증 메일 발송 실패');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      ensureStarted();
      setIsVerifying(true);
      const ok = await verifyEmailCode(fullEmail, code.trim());
      if (ok) {
        setEmailVerified(true);
      }
      toast(ok ? '이메일 인증에 성공했습니다!' : '인증에 실패했습니다. 다시 시도해주세요.');
    } catch (err: unknown) {
      handleError(err, '인증 요청 실패');
    } finally {
      setIsVerifying(false);
    }
  };

  /* 닉네임 중복 검증 */
  const handleVerifyNickname = async () => {
    try {
      ensureStarted();
      setIsSending(true);
      await checkNicknameValidation(nickname);
      toast.success('사용 가능한 닉네임입니다!');
      setIsNicknameChecked(true);
    } catch (err: unknown) {
      const ax = err as AxiosError<{ status?: number; error?: string; message?: string }>;

      if (ax.response?.status === 400 && ax.response?.data?.error === 'DUPLICATE_NICKNAME') {
        toast.error('이미 존재하는 닉네임입니다.');
        setIsNicknameChecked(false);
        return;
      }
      handleError(err, '닉네임 중복 검증에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  /* 학번 중복 검증 */
  const handleVerifyStudentCode = async () => {
    try {
      ensureStarted();
      setIsSending(true);
      await checkStuCodeValidation(studentCode.trim());
      setIsStuCodeChecked(true);
      toast.success('사용 가능한 학번입니다!');
    } catch (err: unknown) {
      handleError(err, '학번 중복 확인 또는 인증 메일 발송 실패');
      toast.error('학번 중복 확인 또는 인증 메일 발송 실패');
    } finally {
      setIsSending(false);
    }
  };

  /* 회원가입 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      ensureStarted();
      gtmPush({ event: 'sign_up_submit', page_path: pagePath });

      let uploadFile = profileImageFile;

      if (uploadFile) {
        // HEIC/HEIF → JPEG 변환
        if (uploadFile.type === 'image/heic' || uploadFile.type === 'image/heif') {
          const blob = (await heic2any({
            blob: uploadFile,
            toType: 'image/jpeg',
            quality: IMAGE_COMPRESSION_QUALITY,
          })) as Blob;

          uploadFile = new File([blob], uploadFile.name.replace(/\.[^/.]+$/, '.jpg'), {
            type: 'image/jpeg',
          });
        }

        // 1MB 이상만 압축
        const limitMB = MAX_FILE_SIZE_MB;
        const maxBytes = limitMB * 1024 * 1024;

        if (uploadFile.size > maxBytes) {
          uploadFile = await imageCompression(uploadFile, {
            maxSizeMB: limitMB,
            maxWidthOrHeight: IMAGE_MAX_WIDTH_OR_HEIGHT,
            useWebWorker: true,
            preserveExif: false,
            fileType: 'image/jpeg',
          });
        }
      }

      const uploadedUrl = uploadFile ? await uploadProfileImage(uploadFile) : null;

      const req = {
        name,
        email: fullEmail,
        password: pw,
        gender,
        nickname,
        departmentName: department,
        studentNumber: Number(studentCode),
        profileImageUrl: uploadedUrl,
      };
      await registerMember(req);
      doneRef.current = 'success';
      gtmPush({ event: 'sign_up', method });
      toast.success('회원가입이 완료되었습니다!');
      navigator('/login');
    } catch (err: unknown) {
      handleError(err, '회원가입 실패');
      toast.error('회원가입에 실패했습니다. 다시 시도해주세요 :');
    }
  };

  return {
    code,
    setCode,
    isSending,
    showCodeInput,
    isVerifying,
    emailVerified,
    isEmailChecked,
    isNicknameChecked,
    isStuCodeChecked,
    setIsEmailChecked,
    setIsNicknameChecked,
    handleSendCode,
    handleVerifyCode,
    handleVerifyNickname,
    handleVerifyStudentCode,
    handleSubmit,
  };
};
