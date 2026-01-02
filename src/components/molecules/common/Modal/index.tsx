import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='bg-white w-[400px] rounded-2xl shadow-lg p-6 relative border-1 border-grey-10'>
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold'
        >
          x
        </button>

        {/* 제목 */}
        {title && <h2 className='text-xl font-semibold mb-4'>{title}</h2>}

        {/* 컨텐츠 */}
        <div>{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
