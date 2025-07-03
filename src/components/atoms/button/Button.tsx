import type { ButtonProps } from './Button.type';
import { colors } from '../../../styles/color';

const Button = ({
  variant = 'main',
  size = 'md',
  shape = 'pill',
  children,
  disabled,
  fullWidth,
  ...props
}: ButtonProps) => {
  const shapeRadius = {
    pill: '9999px', // 기존 값
    rounded: '0.75rem', // 새 값 (12 px 정도)
  } as const;

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
    grey: {
      backgroundColor: disabled ? colors.grey20 : colors.grey40,
      color: colors.white,
    },
    greyLight: {
      backgroundColor: disabled ? colors.grey20 : '#E3E6E6',
      color: disabled ? colors.grey40 : '#999999',
    },
  };

  const { backgroundColor, color } = styleMap[variant];

  return (
    <button
      style={{
        backgroundColor,
        color,
        width: fullWidth ? '100%' : undefined,
        borderRadius: shapeRadius[shape],
        fontWeight: 500,
        transition: 'all 0.2s ease-in-out',
      }}
      className={`${sizeClassName[size]} font-medium cursor-pointer`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
