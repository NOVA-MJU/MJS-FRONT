import { FaSearch } from 'react-icons/fa';

export default function SearchBar() {
  return (
    <div className='flex items-center mt-2 bg-white border border-gray-300 rounded-md px-3 py-2 gap-2'>
      <FaSearch className='text-[#0055ff] text-[1.2rem]' />
      <input
        type='text'
        placeholder='전체 검색창입니다.'
        className='flex-1 px-2 py-1 text-sm text-gray-800 placeholder-gray-400 outline-none'
      />
      <button className='px-4 py-2 bg-[#001f5c] text-white rounded-md font-semibold hover:bg-[#003cb3] transition-colors'>
        검색
      </button>
    </div>
  );
}
