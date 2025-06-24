
import type { ButtonProps } from './Button.type';
import { colors } from '../../../styles/color';

const Button = ({
  variant = 'main',
  size = 'md',
  children,
  disabled,
  fullWidth,
  ...props
}: ButtonProps) => {
  const sizeClassName = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const styleMap = {
    main: {
      backgroundColor: disabled ? colors.grey20 : colors.mju_primary,
      color: colors.white,
    },
    sub: {
      backgroundColor: disabled ? colors.grey20 : '#FFD700',
      color: disabled ? colors.grey40 : colors.mju_primary,
    },
    basic: {
      backgroundColor: disabled ? colors.grey20 : colors.blue20,
      color: disabled ? colors.grey40 : colors.white,
    },
    danger: {
      backgroundColor: disabled ? colors.grey20 : colors.error,
      color: disabled ? colors.grey40 : colors.white,
    },
    chip: {
      backgroundColor: disabled ? colors.grey02 : colors.grey02,
      color: disabled ? colors.grey40 : colors.black,
    },
  };

  const { backgroundColor, color } = styleMap[variant];

  return (
    <button
      style={{
        backgroundColor,
        color,
        width: fullWidth ? '100%' : undefined,
        borderRadius: '9999px',
        fontWeight: 500,
        transition: 'all 0.2s ease-in-out',
      }}
      className={`${sizeClassName[size]} font-medium`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

