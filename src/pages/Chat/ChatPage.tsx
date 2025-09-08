'use client'

import { useState } from "react";
import { useParams } from "react-router-dom";
import { Mic, Plus, Send } from "lucide-react";
import Header from "../../components/Header/Header";
import {  motion } from "framer-motion";
import TypedText from "../../components/TypedText/TypedText";

export default function ChatPage() {
  const { moduleName } = useParams();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isInitial, setIsInitial] = useState(true); // first message state


  //const [loading, setLoading] = useState(false); // new

  // const staticResponses: Record<string, string> = {
  //   bonjour: "Bonjour, comment puis-je vous aider ?",
  //   "quel est ton nom": "Je suis Aïna, votre assistant IA.",
  //   "que peux-tu faire": "Je peux vous aider à gérer vos modules et répondre à vos questions.",
  //   "merci": "Avec plaisir !",
  // };
  
  const handleSend = () => {
    if (!input.trim()) return;
  
    // Add user's message
    setMessages((prev) => [...prev, `👤: ${input}`]);
    setInput("");
  
    if (isInitial) setIsInitial(false);
  
    // Show loader for AI response
    //setLoading(true);
  
    // Simulate API delay (2 seconds for now)
    setTimeout(() => {
      // Add static AI response
      let response = "";
      switch (input.toLowerCase()) {
        case "bonjour":
          response = "Bonjour, comment je peux vous aider ?";
          break;
        case "qui es-tu ?":
          response = "Je suis Aïna, votre assistant IA.";
          break;
        default:
          response = "Je n'ai pas compris, pouvez-vous reformuler ?";
      }
  
      setMessages((prev) => [...prev, `🤖: ${response}`]);
      //setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full 
      bg-gradient-to-r from-white via-slate-100 to-sky-100
      dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950
      bg-[length:200%_200%] animate-gradient-x transition-colors duration-300">

      <Header />

      <div className="relative flex flex-col min-h-screen p-6">
        {/* Messages container */}
        {!isInitial && (
          <motion.div
            key="messages"
            className="absolute top-24 bottom-24 left-6 right-6 overflow-y-auto bg-white/10 backdrop-blur rounded-2xl p-4 shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {messages.map((msg, i) => {
              const isUser = msg.startsWith("👤:");
              const text = msg.replace(/^👤:|🤖:/, "").trim();

              return (
                <div
                  key={i}
                  className={`flex ${isUser ? "justify-start" : "justify-end"} items-end gap-2 mb-2`}
                >
                  {isUser ? (
                    <>
                      {/* User icon */}
                      <div className="flex items-center justify-center w-8 h-8 bg-white/20 text-white rounded-full">
                        👤
                      </div>
                      <div className="bg-indigo-700/80 text-white px-4 py-2 rounded-xl max-w-xs break-words text-left">
                        {text}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-800/90 text-white px-4 py-2 rounded-xl max-w-xs break-words text-left">
                        {text}
                      </div>
                      {/* Aïna logo */}
                      <img
                        src="/logo-blue.png"
                        alt="Aïna"
                        className="w-8 h-8 rounded-full"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}

        {/* TypedText for initial message */}
        {isInitial && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-16 text-center">
            <TypedText
              text={`Demandez à ${moduleName}, sachez plus...`}
              speed={50}
              start={true}
              className="text-white text-lg font-semibold"
            />
          </div>
        )}

        {/* Input bar */}
        <motion.div
          className="w-full flex justify-center mb-5"
          animate={{
            bottom: isInitial ? "40%" : 0,
            top: isInitial ? "auto" : "auto",
            y: isInitial ? "-50%" : 0,
            position: "absolute",
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
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
        </motion.div>
      </div>
    </div>
  );
}