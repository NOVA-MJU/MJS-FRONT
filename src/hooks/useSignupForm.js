//SignUpPage 컴포넌트의 과도한 부담을 줄이기 위한 컴포넌트.
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { verifyMjuEmail, verifyPassword } from '@/util/verifyRegex';
const useSignupForm = () => {
  const [step, setStep] = useState(1);
  const [isSignUpComplete, setIsSignUpcomplete] = useState(false);
  const { signup } = useAuth();

  // 입력 상태
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [department, setDepartment] = useState('');
  const [studentId, setStudentId] = useState('');
  const [gender, setGender] = useState('');
  const [nickname, setNickname] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isMjuEmail, setIsMjuMail] = useState(false);
  const [MjuEmailError, setMjuEmailError] = useState('');

  const [isStepOneValid, setIsStepOneVaild] = useState(false);

  //비밀번호가 입력칸이 바뀔때 -> effect passWord 상태를 최신화 (의존성 배열에 password추가)
  useEffect(() => {
    if (!verifyPassword(password))
      setPasswordError(
        '비밀번호는 영문, 숫자, 특수문자 포함 8-16자여야 합니다.'
      );
    else {
      setPasswordError('');
    }
  }, [password]);
  // 상태 변경을 위한 useEffect
  const [showEmail, setShowEmail] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showStudentId, setShowStudentId] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const [showNickname, setShowNickname] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (name.length >= 2) setShowEmail(true);
    else setShowEmail(false);
  }, [name]);

  useEffect(() => {
    if (!verifyMjuEmail(email) && email.length > 1) {
      setShowPasswordField(false);
      setIsMjuMail(false);
      setMjuEmailError(
        '이메일 형식은 명지대학교의 공식 학생 이메일이어야만 합니다.'
      );
    }
    if (verifyMjuEmail(email)) {
      setShowPasswordField(true);
      setMjuEmailError('');
    }
  }, [email]);

  useEffect(() => {
    if (password.length >= 8) setShowConfirmPassword(true);
    else setShowConfirmPassword(false);
  }, [password]);

  useEffect(() => {
    if (password === confirmPassword && confirmPassword.length > 0) {
      console.log('현재 비밀번호와 확인 비밀번호가 일치합니다.');
      setIsStepOneVaild(true);
    } else {
      setIsStepOneVaild(false);
      console.log('현재 비밀번호와 일치하지 않습니다.');
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (department.length > 2) setShowStudentId(true);
    else setShowStudentId(false);
  }, [department]);

  useEffect(() => {
    if (studentId.length >= 6) setShowGender(true);
    else setShowGender(false);
  }, [studentId]);

  useEffect(() => {
    if (gender) setShowNickname(true);
    else setShowNickname(false);
  }, [gender]);

  //(2상태) 두번째 네개의 값이 다 채워지면 2상태
  const isStepTwoValid = department && studentId && gender && nickname;

  const handleNextStep = () => {
    if (step === 1 && isStepOneValid) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //서버에 보낼 객체값가공
    const newUser = {
      name,
      email,
      password,
      department,
      studentId,
      gender,
      nickname,
    };

    try {
      await signup(newUser);
      setIsSignUpcomplete(true);
      //회원가입 성공하면 로그인 페이지로 리다리엑션
      setTimeout(() => {
        navigate('/login');
      }, 500);
    } catch (e) {
      alert('회원가입에 실패했습니다.');
      console.log('회원가입 실패', e);
    }
  };

  // 리턴값 자체를 객체 타입으로 value 속성에 어떤값 이런식으로 주는게 더 현명
  //그럼 원본 컴포넌트에서 받아볼수 있기때문임!
  return {
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
    errors: {
      passwordError,
      MjuEmailError,
    },
    flags: {
      isMjuEmail,
      isStepOneValid,
      isStepTwoValid,
      isSignUpComplete,
      step,
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
    actions: {
      setShowPassword,
      handleNextStep,
      handleSubmit,
    },
  };
};

export default useSignupForm;
