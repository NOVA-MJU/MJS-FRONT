import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
}

const BtnDum: React.FC<ButtonProps> = ({ text, onClick, type = 'button', variant = 'primary' }) => {
  const baseStyle = 'w-full py-2 rounded';
  const variantStyle =
    variant === 'primary' ? 'bg-[#999999] text-white' : 'bg-[#E3E6E6] text-[#999999]';

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variantStyle}`}>
      {text}
    </button>
  );
};

export default BtnDum;
