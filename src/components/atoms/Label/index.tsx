interface LabelProps {
  lab: string;
  disabled: boolean;
}

const Label: React.FC<LabelProps> = ({ lab, disabled }) => {
  return (
    <div className='flex items-center gap-6'>
      <label
        className={`text-xl font-semibold whitespace-nowrap ${
          disabled ? 'text-grey-40' : 'text-blue-10'
        }`}
      >
        {lab}
      </label>
      <hr className='w-full border-t-2 border-blue-10 rounded-xl' />
    </div>
  );
};

export default Label;
