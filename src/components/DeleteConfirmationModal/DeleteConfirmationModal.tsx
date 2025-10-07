// components/chat/DeleteConfirmationModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  conversationTitle: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  conversationTitle,
}: DeleteConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Supprimer la conversation
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-600 text-left dark:text-gray-300 mb-2">
                  Êtes-vous sûr de vouloir supprimer cette conversation ?
                </p>
                <p className="text-sm  text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    "{conversationTitle}"
                  </span>
                </p>
                <p className="text-xs text-left text-red-600 dark:text-red-400 mt-3">
                  ⚠️ Cette action est irréversible.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}