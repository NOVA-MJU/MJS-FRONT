/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const LoginInput = ({ type, placeholder, onChange }) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        css={inputStyle}
      />
    </div>
  );
};

export default LoginInput;

const inputStyle = css`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #001f5c;
    box-shadow: 0 0 5px rgba(0, 31, 92, 0.3);
  }
`;
