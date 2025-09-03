import { useState } from "react";
import { useParams } from "react-router-dom";
import { Mic, Plus, Send } from "lucide-react";
import Header from "../../components/Header/Header";

export default function ChatPage() {
  const { moduleName } = useParams();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isInitial, setIsInitial] = useState(true); // new state for centered input

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, `👤: ${input}`]);
    setInput("");
    // Move input to bottom after first message
    if (isInitial) setIsInitial(false);
  };

  return (
    <div className="min-h-screen w-full 
      bg-gradient-to-r from-white via-slate-100 to-sky-100
      dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950
      bg-[length:200%_200%] animate-gradient-x transition-colors duration-300">

      <Header />

      <div className="min-h-screen flex flex-col bg-gradient-to-r from-slate-100 to-sky-100 dark:from-gray-950 dark:to-indigo-950 p-6 pt-10">

       

        {/* Messages container */}
        <div className={`flex-1 overflow-y-auto rounded-2xl p-4 mb-4 shadow-md mt-12
          ${isInitial ? "flex items-center justify-center" : "bg-white/10 backdrop-blur"}`}>
          
          {isInitial ? (
            <p className="text-gray-400 text-center text-lg">
              Commencez à poser vos questions…
            </p>
          ) : (
            messages.map((msg, i) => {
              const isUser = msg.startsWith('👤:');
              const text = msg.replace(/^👤:|🤖:/, '').trim();

              return (
                <div
                  key={i}
                  className={`flex ${isUser ? 'justify-start' : 'justify-end'} items-end gap-2 mb-2`}
                >
                  {isUser ? (
                    <>
                      {/* User icon */}
                      <div className="flex items-center justify-center w-8 h-8 bg-white/20 text-white rounded-full">
                        👤
                      </div>
                      <div className="bg-indigo-700/80 text-white px-4 py-2 rounded-xl max-w-xs break-words">
                        {text}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-800/90 text-white px-4 py-2 rounded-xl max-w-xs break-words">
                        {text}
                      </div>
                      {/* Aïna logo */}
                      <img
                        src="/src/assets/aina-logo.png"
                        alt="Aïna"
                        className="w-8 h-8 rounded-full"
                      />
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Input bar */}
        <div className={`w-full flex justify-center mt-4
          ${isInitial ? "absolute top-1/2 transform -translate-y-1/2" : ""}`}>
          <div className="flex items-center gap-2 bg-white rounded-xl p-2 shadow-lg w-5/6 max-w-2xl">
            
            {/* Attachment button */}
            <button className="p-2 rounded-lg bg-transparent text-indigo-700 hover:bg-indigo-50 transition">
              <Plus size={20} />
            </button>

            {/* Text input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Demandez à ${moduleName}…`}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              onFocus={() => isInitial && setIsInitial(false)} // also move on focus
            />

            {/* Send button */}
            <button
              onClick={handleSend}
              className="p-2 rounded-lg bg-transparent text-indigo-700 hover:bg-indigo-50 transition"
            >
              <Send size={20} />
            </button>

            {/* Voice button */}
            <button className="p-2 rounded-lg bg-transparent text-indigo-700 hover:bg-indigo-50 transition">
              <Mic size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

{/* Input bar */}
        {/* <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl p-2 shadow-md">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Comments je puis-vous aidez aujourd'hui…`}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          
          <button
            onClick={handleSend}
            className="p-2 rounded-lg bg-transparent hover:bg-white/10 text-white transition"
          >
            <Send size={18} />
          </button>

          
          <button
            className="p-2 rounded-lg bg-transparent hover:bg-white/10 text-white transition"
          >
            <Mic size={18} />
          </button>
        </div> */}