import TypedText from "../TypedText/TypedText";
import JsonTable from "../../utils/JsonTable";
import type { Message } from "../../pages/Chat/Chat";

type Props = {
  msg: Message;
  onPreview: (title: string) => void;
};

export default function MessageBubble({ msg, onPreview }: Props) {
  return (
    <div className="w-full flex justify-center px-1">
      {msg.isUser ? (
        <div className="flex flex-row-reverse items-start gap-2 w-full max-w-4xl">
          <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-indigo-200 text-indigo-900 rounded-full flex items-center justify-center text-xs sm:text-sm">
            👤
          </div>
          <div className="flex flex-col items-end gap-1 flex-1 min-w-0">
            <div className="bg-indigo-700/80 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl max-w-xs sm:max-w-sm md:max-w-2xl break-words text-left text-sm sm:text-base">
              {msg.text}
            </div>
            {msg.file && (
              <div className="bg-indigo-100/50 dark:bg-indigo-800/50 px-2 py-1 sm:px-3 sm:py-1 rounded-md flex items-center gap-2 max-w-[200px] sm:max-w-sm text-xs">
                <span className="truncate">{msg.file.name}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-start w-full max-w-4xl">
          <div className="flex gap-2 items-start w-full">
            <img src="/logo-blue.png" alt="Aïna" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mt-1 sm:mt-2 flex-shrink-0" />
            <div className="bg-transparent text-gray-900 dark:text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl break-words text-left flex-1 max-w-3xl overflow-x-auto">
              {msg.text && (
                <TypedText 
                  text={msg.text} 
                  speed={20} 
                  start={true} 
                  className="whitespace-pre-line mb-2 text-sm sm:text-base" 
                  asHTML={true} 
                />
              )}
              {msg.rows && msg.rows.length > 0 && <JsonTable data={msg.rows} />}
            </div>
          </div>
          {!msg.rows && msg.sources && msg.sources.length > 0 && (
            <div className="mt-1 sm:mt-2 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm border border-white/10 text-indigo-900 dark:text-indigo-200 px-3 py-2 sm:px-4 sm:py-3 rounded-xl w-full max-w-3xl text-left shadow-sm">
              <p className="text-xs sm:text-sm font-semibold mb-1">📂 Documents associés :</p>
              <div className="space-y-1">
                {msg.sources.map((s, idx) => (
                  <button
                    key={idx}
                    className="block text-left w-full text-xs sm:text-sm text-indigo-700 hover:text-black dark:text-indigo-100 dark:hover:text-white underline truncate"
                    title={s.title}
                    onClick={() => onPreview(s.title)}
                  >
                    {idx + 1}. 📄 {s.title.replace(/\.pdf$/i, "")}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}