import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = '검색어를 입력하세요' }: SearchBarProps) {
  return (
    <div className='flex items-center w-full h-16 bg-white border-2 border-grey-05 rounded-full px-5 gap-3'>
      <FaSearch className='text-grey-20 text-[20px]' />
      <input
        type='text'
        className='flex-1 h-full bg-transparent outline-none text-lg text-black placeholder-grey-20'
        placeholder={placeholder}
      />
    </div>
  );
}
