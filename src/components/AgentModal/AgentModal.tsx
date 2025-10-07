import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: {
    name: string;
    image: string;
    description: React.ReactNode;
    href?: string;
  } | null;
}

export default function AgentModal({ isOpen, onClose, agent }: AgentModalProps) {
  const navigate = useNavigate();

  if (!agent) return null;

  const handleGoToAgent = () => {
    if (agent.href) {
      navigate(agent.href);
      onClose();
    }
  };

  // Configuration des icônes d'arrière-plan par agent
  const getAgentConfig = (agentName: string) => {
    const configs = {
      "Aïna DOC": {
        gradient: "from-blue-600 to-indigo-600",
        icons: ["📄", "📑", "📊", "📈", "🔍", "📋"],
        iconColor: "text-blue-200",
      },
      "Aïna Finance": {
        gradient: "from-green-600 to-emerald-600",
        icons: ["💰", "💹", "📊", "💳", "🏦", "💸"],
        iconColor: "text-green-200",
      },
      "Aïna Vision": {
        gradient: "from-purple-600 to-violet-600",
        icons: ["👁️", "📷", "🖼️", "🔍", "✨", "🌟"],
        iconColor: "text-purple-200",
      },
      "Aïna Search": {
        gradient: "from-orange-500 to-red-500",
        icons: ["🔍", "📌", "📍", "🎯", "🚀", "⚡"],
        iconColor: "text-orange-200",
      },
    };

    return configs[agentName as keyof typeof configs] || configs["Aïna DOC"];
  };

  const agentConfig = getAgentConfig(agent.name);

  // Composant pour les icônes flottantes animées
  const FloatingIcons = () => {
    const icons = agentConfig.icons;
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {icons.map((icon, index) => (
          <motion.div
            key={index}
            className={`absolute ${agentConfig.iconColor} text-2xl opacity-20`}
            initial={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360,
            }}
            animate={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {icon}
          </motion.div>
        ))}
        
        {/* Icônes supplémentaires plus petites */}
        {icons.map((icon, index) => (
          <motion.div
            key={`small-${index}`}
            className={`absolute ${agentConfig.iconColor} text-lg opacity-15`}
            initial={{
              x: Math.random() * 300 - 150,
              y: Math.random() * 300 - 150,
              scale: Math.random() * 0.3 + 0.3,
              rotate: Math.random() * 360,
            }}
            animate={{
              x: Math.random() * 300 - 150,
              y: Math.random() * 300 - 150,
              scale: Math.random() * 0.3 + 0.3,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>
    );
  };

  // Composant pour les particules animées
  const AnimatedParticles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, index) => (
          <motion.div
            key={index}
            className={`absolute w-2 h-2 rounded-full ${agentConfig.iconColor} opacity-10`}
            initial={{
              x: Math.random() * 500 - 250,
              y: Math.random() * 500 - 250,
              scale: 0,
            }}
            animate={{
              x: Math.random() * 500 - 250,
              y: Math.random() * 500 - 250,
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    );
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
          {/* ✅ Image de l'agent */}
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
            className={`bg-gradient-to-br ${agentConfig.gradient} text-white
                       p-6 rounded-lg w-full max-w-lg shadow-xl relative overflow-hidden pt-44`}
            initial={{ scale: 0.8, rotate: "8deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0.8, rotate: "0deg" }}
            transition={{ duration: 0.3 }}
          >
            {/* ✅ Icônes animées en arrière-plan */}
            <FloatingIcons />
            <AnimatedParticles />

            {/* Effet de brillance animé */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />

            <div className="relative z-10 text-left">
              <motion.h3 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {agent.name}
              </motion.h3>
              
              <motion.p 
                className="mb-6 whitespace-pre-line leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {agent.description}
              </motion.p>

              <motion.div 
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {/* ✅ Bouton vers l'agent */}
                <button
                  onClick={handleGoToAgent}
                  className="bg-white text-gray-800 font-semibold px-4 py-2
                             rounded hover:bg-gray-100 transition shadow-lg
                             hover:scale-105 transform duration-200
                             border-2 border-white/50"
                >
                  Aller vers {agent.name}
                </button>

                {/* Fermer */}
                <button
                  onClick={onClose}
                  className="bg-transparent border-2 border-white text-white
                             font-semibold px-4 py-2 rounded hover:bg-white
                             hover:text-gray-800 transition"
                >
                  Fermer
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}