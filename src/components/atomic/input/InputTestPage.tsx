import { useState } from 'react';
import Input from './Input';

const variants = ['field', 'searchbar', 'labelfield'] as const;

const InputTestPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [value, setValue] = useState('');

  return (
    <div className='p-8 space-y-6'>
      <h1 className='text-2xl font-bold'>Input Variant Test</h1>

      {/* 토글 옵션 */}
      <div className='flex gap-4 items-center'>
        <label className='flex items-center gap-2'>
          <input type='checkbox' checked={disabled} onChange={() => setDisabled(!disabled)} />
          Disable
        </label>
        <label className='flex items-center gap-2'>
          <input type='checkbox' checked={error} onChange={() => setError(!error)} />
          Error
        </label>
      </div>

      {variants.map((variant) => (
        <div key={variant} className='space-y-2'>
          <h2 className='font-semibold'>{variant}</h2>
          <Input
            variant={variant}
            label={variant === 'labelfield' ? 'Label Field' : undefined}
            helperText='Helper text goes here'
            maxLength={20}
            showCount={true}
            disabled={disabled}
            error={error}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default InputTestPage;
