// src/pages/Home/Home.tsx
'use client'

import { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header/Header';
import BlurText from '../../utils/BlurText';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import { motion, useInView } from 'framer-motion';
import TypedText from '../../components/TypedText/TypedText';
import { Link } from 'react-router-dom';


export default function Home() {
  const [typedStart, setTypedStart] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const modulesRef = useRef<HTMLElement>(null);

  // Detect when modules section is in view
  const modulesInView = useInView(modulesRef, { margin: '-30% 0px -30% 0px', once: true });

  const handleAnimationComplete = () => setTypedStart(true);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return; // disable scroll snapping on mobile
  
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
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header />

      <div className="relative">
        {/* Hero Slide */}
        <section
          ref={heroRef}
          className="min-h-screen flex flex-col justify-center items-center px-6 lg:px-8 py-12
            bg-gradient-to-r from-white via-slate-100 to-sky-100
            dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950"
        >
          <div className="mx-auto max-w-3xl text-center text-white">
            <BlurText
              text="Bienvenue dans votre espace CLIM-MAG : votre assistante Aïna!"
              delay={150}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleAnimationComplete}
              className="text-4xl sm:text-5xl lg:text-7xl mb-8"
            />
            <TypedText
              start={typedStart}
              text="Aïna, votre IA dédiée, est conçue pour simplifier la gestion de vos documents d’entreprise. Elle vous accompagne au quotidien, en vous offrant des réponses rapides, pour une organisation plus efficace."
              speed={40}
              className="mt-8 text-base sm:text-lg lg:text-xl text-gray-900 dark:text-white"
            />
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
  onClick={goToModules}
  className="rounded-md 
             bg-indigo-900 text-white 
             dark:bg-white/20 dark:text-white
             w-full max-w-xs px-4 py-2 text-sm font-semibold shadow-sm 
             hover:bg-indigo-700 dark:hover:bg-white/30 transition-colors"
>
              Commencer
            </button>
              {/* <a href="#" className="font-semibold underline text-sm sm:text-base">
                En savoir plus →
              </a> */}
            </div>
          </div>
        </section>

      {/* Modules Slide */}
{/* Modules Slide */}
<section
  ref={modulesRef}
  className="min-h-screen py-16 px-6 lg:px-12 font-sans
             bg-gradient-to-r from-white via-slate-50 to-sky-100
             dark:from-gray-950 dark:to-indigo-950
             flex flex-col justify-center items-center
             overflow-y-auto"
>
  {/* Animated Title */}
  {modulesInView && (
    <BlurText
      text="Nos Agents Aïna!"
      delay={150}
      animateBy="words"
      direction="top"
      onAnimationComplete={handleAnimationComplete}
      className="text-3xl sm:text-5xl lg:text-6xl mb-12 text-center
                 text-gray-900 dark:text-white"
    />
  )}

  {/* Responsive Grid */}
  <div className="grid gap-4 sm:gap-6 lg:gap-10 
                grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
                max-w-7xl w-full px-4 sm:px-0 justify-items-center">

    {[
  { title: 'Aïna DOC', desc: 'Analyse de vos documents', img: '/bot-doc.png' },
  { title: 'Aïna Finance', desc: 'Analyse & gestion financière', img: '/bot-finance.png' },
  { title: 'Aïna Vision', desc: 'Vision et prédictions', img: '/bot-vision.png' },
].map((module, index) => (
  <motion.div
    key={module.title}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
    className="w-full
               h-[10rem] sm:h-[16rem] md:h-[20rem] lg:h-[24rem]
               max-w-sm sm:max-w-[18rem] md:max-w-[20rem] lg:max-w-[22rem]
               mx-auto"
  >
    <Link to={`/chat/${encodeURIComponent(module.title)}`}>
      <SpotlightCard
        imageSrc={module.img}   // ✅ IMAGE DE L’AGENT
        className="h-full w-full
                   bg-white/80 dark:bg-gray-800
                   hover:bg-white/90 dark:hover:bg-gray-700
                   transition-colors"
      >
        <h3 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-bold
                       text-gray-900 dark:text-white">
          {module.title}
        </h3>

        <p className="text-[12px] sm:text-sm md:text-base lg:text-lg
                      text-gray-700 dark:text-gray-300 mt-1">
          {module.desc}
        </p>
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