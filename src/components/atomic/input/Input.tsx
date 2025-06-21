import type { InputProps } from './Input.type';
import { colors } from '../../../styles/color';

const Input = ({
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
  const disabled = props.disabled;

  const variantStyleMap: Record<typeof variant, React.CSSProperties> = {
    field: {
      backgroundColor: colors.grey02,
      border: `1px solid ${colors.mju_primary}`,
      borderRadius: '0.375rem', // rounded-md
    },
    searchbar: {
      backgroundColor: colors.grey02,
      border: `1px solid ${colors.grey20}`,
      borderRadius: '9999px',
      display: 'flex',
      alignItems: 'center',
    },
    labelfield: {
      backgroundColor: '#ffffff',
      borderBottom: `1px solid ${colors.grey20}`,
    },
  };

  const wrapperStyle: React.CSSProperties = {
    ...variantStyleMap[variant],
    color: disabled ? colors.grey40 : undefined,
    backgroundColor: disabled ? colors.grey10 : variantStyleMap[variant].backgroundColor,
    borderColor: error ? colors.error : variantStyleMap[variant].borderColor,
    border:
      error && variant !== 'labelfield'
        ? `1px solid ${colors.error}`
        : variantStyleMap[variant].border,
  };

  const isMaxed = typeof value === 'string' && maxLength && value.length >= maxLength;

  return (
    <div className='w-full'>
      {variant === 'labelfield' && label && (
        <label
          className='block mb-1 text-sm font-semibold'
          style={{ color: error ? colors.error : colors.black }}
        >
          {label}
        </label>
      )}

      <div
        className={`${baseClass} w-full`}
        style={{
          ...wrapperStyle,
          ...(isMaxed && !error ? { backgroundColor: '#fee2e2', borderColor: colors.error } : {}),
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      >
        {icon && <span className='mr-2'>{icon}</span>}
        <input
          className='bg-transparent w-full outline-none'
          maxLength={maxLength}
          value={value}
          disabled={disabled}
          onChange={props.onChange}
          style={{
            color: disabled ? colors.grey40 : colors.black,
          }}
          {...props}
        />
        {variant === 'field' && showCount && typeof value === 'string' && maxLength && (
          <span
            className='text-xs ml-2 whitespace-nowrap'
            style={{
              color: isMaxed ? colors.error : colors.grey40,
              fontWeight: isMaxed ? 600 : undefined,
            }}
          >
            {`${value.length}/${maxLength}`}
          </span>
        )}
      </div>

      {helperText && (
        <p
          className='text-xs mt-1'
          style={{
            color: error ? colors.error : colors.grey40,
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
