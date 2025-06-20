import Button from './Button';
import { useState } from 'react';

const variants = ['main', 'sub', 'basic', 'danger', 'chip'] as any;
const sizes = ['sm', 'md', 'lg'] as any;

const ButtonTestPage = () => {
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Button Variant Test Emotion</h1>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={disabled}
          onChange={() => setDisabled(!disabled)}
        />
        Disable All
      </label>

      {variants.map((variant) => (
        <div key={variant}>
          <h2 className="font-semibold">{variant}</h2>
          <div className="flex gap-4 mt-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={variant}
                size={size}
                disabled={disabled}
              >
                {variant} {size}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ButtonTestPage;
