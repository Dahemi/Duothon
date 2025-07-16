import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg'
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-4 text-center sm:block sm:p-6">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className={`
          inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-large transform transition-all 
          sm:my-8 sm:align-middle w-full max-h-[90vh] sm:max-h-[85vh] ${sizeClasses[size]}
        `}>
          {/* Header */}
          <div className="bg-white px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate mr-4">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="rounded-md bg-white p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-4 sm:px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)] sm:max-h-[calc(85vh-120px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
