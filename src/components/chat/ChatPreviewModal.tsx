import React from "react";

interface ChatPreviewModalProps {
  doc: { title: string; path: string } | null;
  onClose: () => void;
}

const ChatPreviewModal: React.FC<ChatPreviewModalProps> = ({
  doc,
  onClose,
}) => {
  if (!doc) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-2 sm:p-4">
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full h-full sm:h-4/5 sm:w-11/12 md:w-5/6 lg:w-2/3">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate flex-1 mr-4">
            {doc.title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* Content */}
        <iframe
          src={doc.path}
          className="w-full h-[calc(100%-4rem)] rounded-b-lg"
          title={doc.title}
        />
      </div>
    </div>
  );
};

export default ChatPreviewModal;