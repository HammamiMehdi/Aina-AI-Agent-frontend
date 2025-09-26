import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface AgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    agent: {
      name: string;
      image: string;
      description: React.ReactNode;
      href?: string;   // ✅ ajout du lien
    } | null;
  }
  
  export default function AgentModal({ isOpen, onClose, agent }: AgentModalProps) {
    const navigate = useNavigate();   // ✅ Hook navigation
  
    if (!agent) return null;
  
    const handleGoToAgent = () => {
      if (agent.href) {
        navigate(agent.href);   // ✅ Redirection
        onClose();              // ✅ Fermer la popup après redirection
      }
    };
  
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="agent-modal"
            className="fixed inset-0 z-[9999] bg-slate-900/30 backdrop-blur
                       grid place-items-center cursor-pointer"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* ✅ Image de l’agent */}
            <motion.img
              src={agent.image}
              alt={agent.name}
              className="absolute top-20 w-60 h-100 object-contain z-[10000]"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
  
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white
                         p-6 rounded-lg w-full max-w-lg shadow-xl relative overflow-hidden pt-44"
              initial={{ scale: 0.8, rotate: "8deg" }}
              animate={{ scale: 1, rotate: "0deg" }}
              exit={{ scale: 0.8, rotate: "0deg" }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative z-10 text-left">
                <h3 className="text-3xl font-bold mb-4">{agent.name}</h3>
                <p className="mb-6 whitespace-pre-line leading-relaxed">
                  {agent.description}
                </p>
  
                <div className="flex gap-3">
                  {/* ✅ Bouton vers l’agent */}
                  <button
                    onClick={handleGoToAgent}
                    className="bg-white text-indigo-600 font-semibold px-4 py-2
                               rounded hover:bg-gray-100 transition"
                  >
                    Aller vers l’agent
                  </button>
  
                  {/* Fermer */}
                  <button
                    onClick={onClose}
                    className="bg-transparent border border-white text-white
                               font-semibold px-4 py-2 rounded hover:bg-white
                               hover:text-indigo-600 transition"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }