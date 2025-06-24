import type { InputProps } from '../input/Input.type';
import { colors } from '../../../styles/color';

const Button = ({
  variant = 'field',
  label,
  helperText,
  maxLength,
  showCount,
  error = false,
  icon,
  value,
  ...props
}: InputProps) => {
  const baseClass = 'px-4 py-2 text-sm';
  const errorClass = error ? `border-[${colors.error}] text-[${colors.error}]` : '';
  const disabledClass = props.disabled
    ? `bg-[${colors.grey10}] text-[${colors.grey40}] cursor-not-allowed`
    : '';

  const variantClassMap = {
    field: `bg-[${colors.grey02}] border border-[${colors.grey20}] rounded-md`,
    searchbar: `bg-[${colors.grey02}] rounded-full flex items-center border border-[${colors.grey20}]`,
    labelfield: `bg-white border-b border-[${colors.grey20}] focus-within:border-[${colors.mju_primary}]`,
  };

  const isMaxed = typeof value === 'string' && maxLength && value.length >= maxLength;
  const maxClass = isMaxed && !error ? `border-[${colors.error}] bg-red-50` : '';

  return (
    <div className='w-full'>
      {variant === 'labelfield' && label && (
        <label
          className={`block mb-1 text-sm ${
            error ? `text-[${colors.error}]` : 'text-black font-semibold'
          }`}
        >
          {label}
        </label>
      )}

      <div
        className={`w-full ${variantClassMap[variant]} ${baseClass} ${errorClass} ${disabledClass} ${maxClass}`}
      >
        {icon && <span className='mr-2'>{icon}</span>}
        <input
          className='bg-transparent w-full outline-none'
          maxLength={maxLength}
          value={value}
          {...props}
        />
        {variant === 'field' && showCount && typeof value === 'string' && maxLength && (
          <span
            className={`text-xs ml-2 whitespace-nowrap ${
              isMaxed ? `text-[${colors.error}] font-semibold` : `text-[${colors.grey40}]`
            }`}
          >
            {`${value.length}/${maxLength}`}
          </span>
        )}
      </div>

      {helperText && (
        <p
          className={`text-xs mt-1 ${error ? `text-[${colors.error}]` : `text-[${colors.grey40}]`}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Button;
