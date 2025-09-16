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
      if (window.innerWidth < 1024) return; // 🔹 disable forced scroll snap on small screens

      if (e.deltaY > 0 && currentSlide === 0) {
        modulesRef.current?.scrollIntoView({ behavior: 'smooth' });
        setCurrentSlide(1);
      } else if (e.deltaY < 0 && currentSlide === 1) {
        heroRef.current?.scrollIntoView({ behavior: 'smooth' });
        setCurrentSlide(0);
      }
    };

    window.addEventListener('wheel', handleScroll);
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
              text="Aïna, votre intelligence artificielle dédiée, est conçue pour simplifier la gestion de vos documents d’entreprise.
              Elle vous accompagne au quotidien, en vous offrant des réponses rapides, des décisions fiables et une organisation plus efficace."
              speed={40}
              className="mt-8 text-base sm:text-lg lg:text-xl text-gray-900 dark:text-white"
            />
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={goToModules}
                className="rounded-md bg-white/20 backdrop-blur px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/30"
              >
                Commencer
              </button>
              <a href="#" className="font-semibold underline text-sm sm:text-base">
                En savoir plus →
              </a>
            </div>
          </div>
        </section>

      {/* Modules Slide */}
{/* Modules Slide */}
<section
  ref={modulesRef}
  className="min-h-screen py-16 px-6 lg:px-12 font-sans
    bg-gradient-to-r from-slate-100 to-sky-100
    dark:from-gray-950 dark:to-indigo-950 flex flex-col justify-center items-center"
>
  {/* Animated Title */}
  {modulesInView && (
    <BlurText
      text="Nos Agents Aïna!"
      delay={150}
      animateBy="words"
      direction="top"
      onAnimationComplete={handleAnimationComplete}
      className="text-3xl sm:text-5xl lg:text-6xl mb-12 text-center text-white"
    />
  )}

  {/* Responsive Grid */}
  <div className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl w-full">
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
      transition={{ delay: index * 0.2, duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-sm sm:max-w-[18rem] md:max-w-[20rem] lg:max-w-[22rem] h-[22rem] sm:h-[24rem] lg:h-[26rem] mx-auto"
    >
      <Link to={`/chat/${encodeURIComponent(module.title)}`}>
        <SpotlightCard imageSrc={module.img} className="h-full w-full">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-sans">
            {module.title}
          </h3>
          <p className="text-gray-300 mt-4 font-sans text-sm sm:text-base">
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