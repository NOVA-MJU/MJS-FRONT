import { useState } from 'react';
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
import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';

/**
 * 회원가입 관련 상태와 이벤트 핸들러를 제공하는 커스텀 훅
 *
 * 이 훅은 회원가입 시 필요한 api를 한 번에 처리합니다.
 * 이메일 인증, 닉네임/학번 중복 확인, 프로필 이미지 변환 및 압축,
 * 회원가입 요청 처리 로직을 포함합니다.
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
  const fullEmail = `${id}@mju.ac.kr`;
  const navigator = useNavigate();

  const [code, setCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isStuCodeChecked, setIsStuCodeChecked] = useState(false);

  /* 공통 에러 처리 */
  const handleError = (err: unknown, defaultMsg = '알 수 없는 오류') => {
    const axiosError = err as AxiosError<{ message: string }>;
    console.error(axiosError?.response?.data?.message || defaultMsg);
    alert(axiosError?.response?.data?.message || defaultMsg);
  };

  const handleSendCode = async () => {
    try {
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
      let uploadFile = profileImageFile;

      if (uploadFile) {
        // HEIC/HEIF → JPEG 변환
        if (uploadFile.type === 'image/heic' || uploadFile.type === 'image/heif') {
          const blob = (await heic2any({
            blob: uploadFile,
            toType: 'image/jpeg',
            quality: 0.9,
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
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            preserveExif: false,
            fileType: 'image/jpeg',
          });

          if (uploadFile.size > maxBytes) {
            toast.error(`프로필 이미지를 ${limitMB}MB 이하로 줄여주세요.`);
            return;
          }
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
