import { Mic, Plus, Send } from "lucide-react";
import React, { type Dispatch, type RefObject, type SetStateAction } from "react";

interface ChatInputProps {
  moduleName: string;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  onSend: (userQuery: string) => Promise<void>;
  attachedFile: File | null;
  setAttachedFile: Dispatch<SetStateAction<File | null>>;
  loading: boolean;
  recording: boolean;
  setRecording: Dispatch<SetStateAction<boolean>>;
  recognitionRef: RefObject<any>;
}

const ChatInput: React.FC<ChatInputProps> = ({
  moduleName,
  input,
  setInput,
  onSend,
  attachedFile,
  setAttachedFile,
  loading,
  recording,
  setRecording,
  recognitionRef,
}) => {
  return (
    <div
      className="flex items-center gap-2 bg-white dark:bg-gray-900 
                 rounded-xl p-2 sm:p-3 shadow-lg w-full max-w-4xl
                 border border-gray-200 dark:border-gray-700"
    >
      {/* Upload fichier */}
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setAttachedFile(file);
        }}
      />
      <button
        onClick={() => document.getElementById("file-upload")?.click()}
        className="p-2 rounded-lg bg-transparent text-indigo-700 
                   hover:bg-indigo-50 dark:hover:bg-gray-800 transition
                   flex-shrink-0"
        disabled={loading}
      >
        <Plus size={18} className="sm:w-5 sm:h-5" />
      </button>

      {/* Champ texte */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Demandez à ${moduleName}…`}
        className="flex-1 bg-transparent outline-none text-sm sm:text-base
                   text-gray-900 dark:text-white placeholder-gray-400
                   min-w-0" // Prevent overflow
        onKeyDown={(e) => {
          if (e.key === "Enter") onSend(input);
        }}
        disabled={loading}
      />

      {/* File indicator */}
      {attachedFile && (
        <div className="flex-shrink-0 text-xs text-indigo-600 dark:text-indigo-400 truncate max-w-[80px] sm:max-w-[120px]">
          📎 {attachedFile.name}
        </div>
      )}

      {/* Microphone */}
      <button
        onClick={() => {
          if (!recording) {
            if (
              !("webkitSpeechRecognition" in window ||
                "SpeechRecognition" in window)
            ) {
              alert("Reconnaissance vocale non supportée par votre navigateur.");
              return;
            }

            const SpeechRecognition =
              (window as any).SpeechRecognition ||
              (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = "fr-FR";
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognitionRef.current = recognition;
            setRecording(true);
            recognition.start();

            recognition.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript;
              setInput(transcript);
            };

            recognition.onend = () => setRecording(false);
            recognition.onerror = () => setRecording(false);
          } else {
            if (recognitionRef.current) recognitionRef.current.stop();
            setRecording(false);
          }
        }}
        className={`p-2 rounded-lg transition flex-shrink-0 ${
          recording
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-transparent text-indigo-700 hover:bg-indigo-50"
        }`}
        disabled={loading}
      >
        {recording ? (
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-sm" />
        ) : (
          <Mic size={18} className="sm:w-5 sm:h-5" />
        )}
      </button>

      {/* Envoyer */}
      <button
        onClick={() => onSend(input)}
        disabled={loading || (!input.trim() && !attachedFile)}
        className="p-2 rounded-lg bg-transparent text-indigo-700 
                   hover:bg-indigo-50 dark:hover:bg-gray-800 
                   transition disabled:opacity-50 flex-shrink-0"
      >
        <Send size={18} className="sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

export default ChatInput;