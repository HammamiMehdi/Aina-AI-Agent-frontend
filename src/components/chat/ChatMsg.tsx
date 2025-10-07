import { motion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import type { Message } from "../../pages/Chat/Chat";

type Props = {
  messages: Message[];
  loading: boolean;
  onPreview: (title: string) => void;
};

export default function ChatMsg({ messages, loading, onPreview }: Props) {
  return (
    <motion.div
      key="messages"
      className="absolute top-16 sm:top-20 bottom-28 sm:bottom-24 left-0 right-0 mx-auto flex flex-col items-center gap-4 sm:gap-6 w-full max-w-4xl px-3 sm:px-6 bg-transparent backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm sm:shadow-md overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-transparent hover:scrollbar-thumb-indigo-400 dark:scrollbar-thumb-indigo-600 dark:hover:scrollbar-thumb-indigo-500"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {messages.map((msg, i) => (
        <MessageBubble key={i} msg={msg} onPreview={onPreview} />
      ))}

      {loading && (
        <div className="flex justify-start items-center gap-2 mt-2 ml-8 sm:ml-12 w-full max-w-4xl">
          <img src="/logo-blue.png" alt="Aïna" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0" />
          <div className="bg-gray-100/90 dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2 max-w-[280px] sm:max-w-[300px] animate-pulse">
            <span className="text-sm sm:text-base">Génération...</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
}