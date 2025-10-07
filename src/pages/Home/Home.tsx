// src/pages/Home/Home.tsx
'use client'

import { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header/Header';
import BlurText from '../../utils/BlurText';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import { motion, useInView } from 'framer-motion';
import TypedText from '../../components/TypedText/TypedText';
import { Link } from 'react-router-dom';
import AnimatedPrism from '../../utils/AnimatedPrism';


// Configuration centralisée des modules
const MODULES_CONFIG = [
  { 
    title: 'Aïna DOC', 
    desc: 'Analyse de vos documents', 
    img: '/bot-doc.png',
    size: 'medium' as const
  },
  { 
    title: 'Aïna Finance', 
    desc: 'Analyse & gestion financière', 
    img: '/bot-finance.png',
    size: 'medium' as const
  },
  { 
    title: 'Aïna Vision', 
    desc: 'Vision et prédictions', 
    img: '/bot-vision.png',
    size: 'medium' as const
  },
  { 
    title: 'Aïna Search', 
    desc: 'Recherche intelligente', 
    img: '/bot-search.png',
    size: 'medium' as const
  }
];

export default function Home() {
  const [typedStart, setTypedStart] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const modulesRef = useRef<HTMLElement>(null);

  const modulesInView = useInView(modulesRef, { margin: '-30% 0px -30% 0px', once: true });
  const handleAnimationComplete = () => setTypedStart(true);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return;

      if (e.deltaY > 0 && currentSlide === 0) {
        modulesRef.current?.scrollIntoView({ behavior: 'smooth' });
        setCurrentSlide(1);
      } else if (e.deltaY < 0 && currentSlide === 1) {
        heroRef.current?.scrollIntoView({ behavior: 'smooth' });
        setCurrentSlide(0);
      }
    };

    if (window.innerWidth >= 1024) {
      window.addEventListener('wheel', handleScroll);
    }

    return () => window.removeEventListener('wheel', handleScroll);
  }, [currentSlide]);

  const goToModules = () => {
    modulesRef.current?.scrollIntoView({ behavior: 'smooth' });
    setCurrentSlide(1);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative">
      {/* ✅ Prisme animé en arrière-plan */}
      <AnimatedPrism 
        className="z-0"
        speed={60}
        size={500}
      />
      
      <Header />

      <div className="relative z-10">
        {/* Hero Slide */}
        <section
          ref={heroRef}
          className="min-h-screen flex flex-col justify-center items-center px-6 lg:px-8 py-12
            bg-gradient-to-r from-white/80 via-slate-100/80 to-sky-100/80
            dark:from-gray-950/80 dark:via-gray-900/80 dark:to-indigo-950/80
            backdrop-blur-sm"
        >
          <div className="mx-auto max-w-3xl text-center text-white relative z-10">
            <BlurText
              text="Bienvenue dans votre espace CLIM-MAG : votre assistante Aïna!"
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-4xl sm:text-5xl lg:text-7xl mb-8 relative z-10"
            />
            <TypedText
              start={typedStart}
              text="Aïna, votre IA dédiée, est conçue pour simplifier la gestion de vos documents d'entreprise. Elle vous accompagne au quotidien, en vous offrant des réponses rapides, pour une organisation plus efficace."
              speed={40}
              className="mt-8 text-base sm:text-lg lg:text-xl text-gray-900 dark:text-white relative z-10"
            />
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 relative z-10">
              <button
                onClick={goToModules}
                className="rounded-md 
                  bg-indigo-900 text-white 
                  dark:bg-white/20 dark:text-white
                  w-full max-w-xs px-4 py-2 text-sm font-semibold shadow-sm 
                  hover:bg-indigo-700 dark:hover:bg-white/30 transition-colors
                  backdrop-blur-sm"
              >
                Commencer
              </button>
            </div>
          </div>
        </section>

        {/* Modules Slide */}
        <section
          ref={modulesRef}
          className="min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans
            bg-gradient-to-r from-white/90 via-slate-50/90 to-sky-100/90
            dark:from-gray-950/90 dark:to-indigo-950/90
            flex flex-col justify-center items-center
            overflow-y-auto
            backdrop-blur-sm"
        >
          {/* Animated Title */}
          {modulesInView && (
            <BlurText
              text="Nos Agents Aïna!"
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-3xl sm:text-5xl lg:text-6xl mb-8 sm:mb-12 text-center
                text-gray-900 dark:text-white px-4 relative z-10"
            />
          )}

          {/* Responsive Grid pour 4 modules - Amélioré pour mobile */}
          <div className="grid gap-4 sm:gap-6 lg:gap-8 
            grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 
            max-w-7xl w-full px-2 sm:px-4 justify-items-center
            auto-rows-fr relative z-10">
            
            {MODULES_CONFIG.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                className="w-full
                  max-w-[20rem] sm:max-w-[16rem] md:max-w-[18rem] lg:max-w-[20rem] xl:max-w-[22rem]
                  h-full"
              >
                <Link 
                  to={`/chat/${encodeURIComponent(module.title)}`}
                  className="block h-full"
                >
                  <SpotlightCard
                    imageSrc={module.img}
                    size={module.size}
                    className="h-full w-full
                      bg-white/80 dark:bg-gray-800
                      hover:bg-white/90 dark:hover:bg-gray-700
                      transition-all duration-300
                      hover:scale-105 hover:shadow-xl
                      border border-gray-200 dark:border-gray-700
                      backdrop-blur-sm"
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div className="z-20 relative">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold
                          text-gray-900 dark:text-white mb-2
                          drop-shadow-sm">
                          {module.title}
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base
                          text-gray-700 dark:text-gray-300
                          drop-shadow-sm">
                          {module.desc}
                        </p>
                      </div>
                      <div className="mt-3 text-indigo-600 dark:text-indigo-400 text-sm font-semibold z-20 relative">
                        Accéder →
                      </div>
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}