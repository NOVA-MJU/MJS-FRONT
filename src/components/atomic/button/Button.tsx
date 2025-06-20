import type { ButtonProps } from './Button.type';
const Button = ({ variant = 'main', size = 'md', children, disabled, ...props }: ButtonProps) => {
  const baseButtonClassName = 'rounded-full px-4 py-2 font-medium transtion';
  const variantButtonClassName = {
    main: disabled ? 'bg-grey20 text-white' : 'bg-mju_primary text-white hover:bg-blue35',
    sub: disabled ? 'bg-grey20 text-grey40' : 'bg-grey20 text-mju_primary hover:bg-grey10',
    basic: disabled ? 'bg-grey20 text-grey40' : 'bg-blue20 text-white hover:bg-blue35',
    danger: disabled ? 'bg-grey20 text-grey40' : 'bg-error text-white hover:bg-red-600',
    chip: disabled ? 'bg-grey02 text-grey40' : 'bg-grey02 text-black hover:bg-grey10',
  };
  const sizeButtonClassName = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  return (
    <button
      className={`${baseButtonClassName} ${variantButtonClassName[variant]} ${sizeButtonClassName[size]}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
