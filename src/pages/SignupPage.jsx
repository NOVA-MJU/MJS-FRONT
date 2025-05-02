/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import useSignupForm from '@/hooks/useSignupForm';
import { FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa'; // 눈 아이콘 추가

const modalOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const modalContentStyle = css`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;
`;

const inputContainerStyle = css`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
`;

const inputStyle = css`
  flex: 1;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const signupModalTitle = css`
  color: navy;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
`;

const eyeIconStyle = css`
  position: absolute;
  right: 10px;
  font-size: 18px;
  cursor: pointer;
  color: #007aff;
`;

const buttonStyle = (enabled) => css`
  width: 100%;
  padding: 1rem;
  background-color: ${enabled ? '#001f5c' : '#aaa'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${enabled ? 'pointer' : 'not-allowed'};
`;

const ErrorStyle = css`
  color: red;
  font-size: 12px;
  text-align: left;
  width: 100%;
  margin-top: -8px;
  margin-bottom: 10px;
`;

const ConfirmStyle = css`
  color: #28a745; /* 연두색 */
  font-size: 12px;
  text-align: left;
  width: 100%;
  margin-top: -8px;
  margin-bottom: 10px;
`;

const successIconStyle = css`
  font-size: 3rem;
  color: #001f5c;
  margin-bottom: 1rem;
`;

const SignUpPage = ({ closeSignUpModal }) => {
  //커스텀훅의 return 값을 중첩 구조분해 할당하여 return
  const {
    values: {
      name,
      email,
      password,
      confirmPassword,
      department,
      studentId,
      gender,
      nickname,
    },
    setters: {
      setName,
      setEmail,
      setPassword,
      setConfirmPassword,
      setDepartment,
      setStudentId,
      setGender,
      setNickname,
    },
    errors: { passwordError, MjuEmailError },
    flags: {
      isStepOneValid,
      isStepTwoValid,
      step,
      isSignUpComplete,
      isMjuEmail,
    },
    display: {
      showEmail,
      showPasswordField,
      showConfirmPassword,
      showStudentId,
      showGender,
      showNickname,
      showPassword,
    },
    actions: { setShowPassword, handleNextStep, handleSubmit },
  } = useSignupForm();

  return (
    <div css={modalOverlayStyle} onClick={closeSignUpModal}>
      <div css={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        {isSignUpComplete ? (
          <div>
            <FaCheck css={successIconStyle} />
            <h2>회원가입을 성공하였습니다!</h2>
            <button onClick={closeSignUpModal} css={buttonStyle(true)}>
              확인
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div css={signupModalTitle}>회원가입</div>
              {step === 1 && (
                <>
                  <input
                    type="text"
                    value={name}
                    placeholder="이름"
                    onChange={(e) => setName(e.target.value)}
                    css={inputStyle}
                  />
                  {!isMjuEmail ? (
                    <span css={ErrorStyle}> {MjuEmailError}</span>
                  ) : null}
                  {showEmail && (
                    <input
                      type="email"
                      value={email}
                      placeholder="이메일"
                      onChange={(e) => setEmail(e.target.value)}
                      css={inputStyle}
                    />
                  )}
                  {/* 비밀번호의 형식을 갖추지 않고 쓸 경우의 오류 */}
                  {passwordError && password.length > 1 ? (
                    <span css={ErrorStyle}>{passwordError}</span>
                  ) : null}
                  {showPasswordField && (
                    <div css={inputContainerStyle}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        placeholder="비밀번호"
                        onChange={(e) => setPassword(e.target.value)}
                        css={inputStyle}
                      />
                      <span
                        css={eyeIconStyle}
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  )}

                  {showConfirmPassword && (
                    <input
                      type="password"
                      value={confirmPassword}
                      placeholder="비밀번호 확인"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      css={inputStyle}
                    />
                  )}

                  {/* 확인 비밀번호를 틀릴경우  */}
                  {confirmPassword && confirmPassword !== password ? (
                    <p css={ErrorStyle}>비밀번호가 일치하지 않습니다.</p>
                  ) : confirmPassword && confirmPassword === password ? (
                    <p css={ConfirmStyle}>확인되었습니다!</p>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStepOneValid}
                    css={buttonStyle(isStepOneValid)}
                  >
                    다음
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <input
                    type="text"
                    value={department}
                    placeholder="학과"
                    onChange={(e) => setDepartment(e.target.value)}
                    css={inputStyle}
                  />
                  {showStudentId && (
                    <input
                      type="text"
                      value={studentId}
                      placeholder="학번"
                      onChange={(e) => setStudentId(e.target.value)}
                      css={inputStyle}
                    />
                  )}
                  {showGender && (
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      css={inputStyle}
                    >
                      <option value="">성별 선택</option>
                      <option value="MALE">남</option>
                      <option value="FEMALE">여</option>
                      <option value="OTHERS">Others</option>
                    </select>
                  )}
                  {showNickname && (
                    <input
                      type="text"
                      value={nickname}
                      placeholder="닉네임"
                      onChange={(e) => setNickname(e.target.value)}
                      css={inputStyle}
                    />
                  )}
                  <button
                    type="submit"
                    disabled={!isStepTwoValid}
                    css={buttonStyle(isStepTwoValid)}
                  >
                    회원가입
                  </button>
                </>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
