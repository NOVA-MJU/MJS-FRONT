interface LabelButtonProps {
  label: string;
  onClick?: () => void;
  emphasized?: boolean; // 강조 여부
}
const LabelButton: React.FC<LabelButtonProps> = ({ label, onClick, emphasized = false }) => {
  const textClass = emphasized
    ? 'text-mju-primary text-xl font-semibold'
    : 'text-black font-normal font-medium';
  const widthClass = emphasized ? 'w-36' : 'w-full';
  return (
    <button onClick={onClick} className={`${widthClass} flex justify-between items-center`}>
      <span className={`text-base ${textClass}`}>{label}</span>
      <img src='/assets/angle-bracket.svg' alt='to_go_button' className='w-5 h-5' />
    </button>
  );
};

export default LabelButton;
