import { useState } from 'react';
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
      alert('인증 메일을 발송했습니다. 메일함을 확인하세요!');
      setShowCodeInput(true);
    } catch (err: unknown) {
      handleError(err, '이메일 중복 확인 또는 인증 메일 발송 실패');
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
        alert('이메일 인증이 완료되었습니다.');
      } else {
        alert('인증에 실패했습니다. 인증번호를 다시 확인하세요.');
      }
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
      const res = await checkNicknameValidation(nickname);
      setIsNicknameChecked(true);
      alert(res.data);
    } catch (err: unknown) {
      handleError(err, '닉네임 중복 검증 실패');
    } finally {
      setIsSending(false);
    }
  };

  /* 학번 중복 검증 */
  const handleVerifyStudentCode = async () => {
    try {
      setIsSending(true);
      const res = await checkStuCodeValidation(studentCode.trim());
      setIsStuCodeChecked(true);
      alert(res.data);
    } catch (err: unknown) {
      handleError(err, '학번 중복 확인 또는 인증 메일 발송 실패');
    } finally {
      setIsSending(false);
    }
  };

  /* 회원가입 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const uploadedUrl = profileImageFile ? await uploadProfileImage(profileImageFile) : null;
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
      alert('회원가입이 완료되었습니다!');
      navigator('/login');
    } catch (err: unknown) {
      handleError(err, '회원가입 실패');
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
