//검증 정규식 (영문,숫자, 그리고 특수문자도 가능요)
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,16}$/;

const MJU_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@mju\.ac\.kr$/;


export const verifyPassword = (password) => {
  return password.length > 0 && PASSWORD_REGEX.test(password);
};

export const verifyMjuEmail = (email) => {
  return email.length > 0 && MJU_EMAIL_REGEX.test(email);
};


