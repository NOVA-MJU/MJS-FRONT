import React, { forwardRef } from 'react';
import type { InputProps, InputVariant } from './Input.type';
import { colors } from '../../../styles/color';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'field',
      label,
      helperText,
      maxLength,
      showCount,
      error = false,
      icon,
      value,
      defaultValue,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variantStyleMap: Record<InputVariant, React.CSSProperties> = {
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
        backgroundColor: colors.white,
        borderBottom: `1px solid ${colors.grey20}`,
      },
      outlined: {
        backgroundColor: colors.white,
        outline: `2px solid ${colors.grey10}`,
        outlineOffset: '-2px',
        borderRadius: '0.75rem',
        border: 'none',
      },
    };
    const variantExtraClass: Record<InputVariant, string> = {
      field: 'px-4 py-2 text-sm',
      searchbar: 'px-4 py-2 text-sm',
      labelfield: 'px-4 py-2 text-sm',
      outlined: 'p-3 text-base',
    };

    const wrapperStyle: React.CSSProperties = {
      ...variantStyleMap[variant],
      color: disabled ? colors.grey40 : undefined,
      backgroundColor: disabled ? colors.white : variantStyleMap[variant].backgroundColor,
      borderColor: error ? colors.error : variantStyleMap[variant].borderColor,
      border:
        error && variant !== 'labelfield'
          ? `1px solid ${colors.error}`
          : `1px solid ${colors.white}`,
    };

    const isMaxed = typeof value === 'string' && maxLength && value.length >= maxLength;

    return (
      <div className='w-full'>
        {variant === 'labelfield' && label && (
          <label
            className={`block mb-1 text-sm ${
              disabled ? 'font-medium text-grey-40' : 'font-semibold'
            }`}
            style={{ color: error ? colors.error : disabled ? colors.grey40 : colors.black }}
          >
            {label}
          </label>
        )}

        <div
          className={`w-full ${variantExtraClass[variant]}`}
          style={{
            ...wrapperStyle,
            ...(isMaxed && !error
              ? { backgroundColor: colors.errorBackground, borderColor: colors.error }
              : {}),
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        >
          {icon && <span className='mr-2'>{icon}</span>}
          <input
            ref={ref}
            className='bg-transparent w-full outline-none placeholder:text-grey-20'
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
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
          <p className='text-xs ml-1 mt-2' style={{ color: error ? colors.error : colors.grey40 }}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

export default Input;
