import React from 'react';

interface DividerProps {
  width: string; // e.g. 'w-[306px]'
}

const Divider: React.FC<DividerProps> = ({ width }) => (
  <hr className={`${width} border-t-2 border-[#6898DE] rounded-xl`} />
);

export default Divider;
