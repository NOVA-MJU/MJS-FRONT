/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import PropTypes from 'prop-types';

const Button = ({ children, variant = 'primary', className = '', ...rest }) => {
  return (
    <button
      css={[baseStyles, styleVariant[variant] || styleVariant.primary]}
      className={className}
      {...rest}
    >
      <span>
        {children}
      </span>
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'outline']),
  className: PropTypes.string,
}

export default Button

const baseStyles = css`
  border-radius: 0.75rem; 
  border: none; 
  cursor: pointer;
  transition: background-color 0.3s ease;
`

const styleVariant = {
  primary: css`
    background-color: #0d2864; 
    color: #fff; 
    text-align: center; 

    &:hover {
      background-color: #244a94;
    }
  `,
  outline: css`
    background-color: #ffffff;
    color: #333; 
    text-align: center; 

    &:hover {
      background-color: #0000000f;
    }
  `,
}
