import React from 'react';

interface LabelProps {
  text: string;
  htmlFor?: string;
  color?: string;
}

const Label: React.FC<LabelProps> = ({ text, htmlFor, color }) => (
  <label htmlFor={htmlFor} className='text-xl font-semibold' style={{ color }}>
    {text}
  </label>
);

export default Label;
