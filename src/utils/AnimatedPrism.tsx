// src/components/AnimatedPrism/AnimatedPrism.tsx
import { motion } from 'framer-motion';

interface AnimatedPrismProps {
    className?: string;
    speed?: number;
    size?: number;
  }
  
  export default function AnimatedPrism({ 
    className = '', 
    speed = 50,
    size = 400 
  }: AnimatedPrismProps) {
    return (
      <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Prisme principal */}
        <motion.div
          className="absolute"
          style={{
            width: size,
            height: size,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Face avant du prisme */}
          <div
            className="absolute w-full h-full"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
              backdropFilter: 'blur(10px)',
            }}
          />
          
          {/* Face gauche du prisme */}
          <div
            className="absolute w-full h-full"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 50% 100%)',
              background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))',
              backdropFilter: 'blur(10px)',
              transform: 'rotateY(60deg)',
              transformOrigin: 'left center',
            }}
          />
          
          {/* Face droite du prisme */}
          <div
            className="absolute w-full h-full"
            style={{
              clipPath: 'polygon(50% 0%, 100% 100%, 50% 100%)',
              background: 'linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
              backdropFilter: 'blur(10px)',
              transform: 'rotateY(-60deg)',
              transformOrigin: 'right center',
            }}
          />
        </motion.div>
  
        {/* Effets de lumière */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)',
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
  
        {/* Particules flottantes */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-indigo-300/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }