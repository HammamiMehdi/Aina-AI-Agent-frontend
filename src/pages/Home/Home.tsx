// src/pages/Home/Home.tsx
'use client'

import { useRef, useState } from 'react';
import Header from '../../components/Header/Header';
import BlurText from '../../utils/BlurText';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import { motion } from 'framer-motion';
import TypedText from '../../components/TypedText/TypedText';
import { Link } from 'react-router-dom';

// const logo = new URL('../../assets/logo-blue.png', import.meta.url).href;
// const navigation = [
//   { name: 'Product', href: '#' },
//   { name: 'Features', href: '#' },
//   { name: 'Marketplace', href: '#' },
//   { name: 'Company', href: '#' },
// ];

export default function Home() {

  // const items = [
  //   {
  //     label: "A Propos",
  //     bgColor: "#0D0716",
  //     textColor: "#fff",
  //     links: [
  //       { label: "Documentation", ariaLabel: "Documentation" },
  //       { label: "A Propos", ariaLabel: "A Propos" }
  //     ]
  //   },
  //   {
  //     label: "Projets",
  //     bgColor: "#170D27",
  //     textColor: "#fff",
  //     links: [
  //       { label: "Featured", ariaLabel: "Featured Projects" },
  //       { label: "Cas d'utilisation", ariaLabel: "Cas d'utilisation" }
  //     ]
  //   },
  //   {
  //     label: "Modules",
  //     bgColor: "#271E37",
  //     textColor: "#fff",
  //     links: [
  //       { label: "Analyse DOC", ariaLabel: "Email us" },
  //       { label: "Analyse financière", ariaLabel: "Analyse financière" },
  //       { label: "Vision", ariaLabel: "Vision" },
  //       { label: "OCR", ariaLabel: "OCR" }
  //     ]
  //   }
  // ];



  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typedStart, setTypedStart] = useState(false);

  const handleAnimationComplete = () => {
    console.log('BlurText animation completed!');
    setTypedStart(true); // start the typed text
  };

  const modulesRef = useRef<HTMLElement>(null);


  return (
    <div
      className="min-h-screen w-full 
      bg-gradient-to-r 
        from-white via-slate-100 to-sky-100
      dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950
      bg-[length:200%_200%] animate-gradient-x transition-colors duration-300"
    >
      {/* <div className="min-h-screen w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 bg-[length:200%_200%] animate-gradient-x transition-colors duration-300"></div> */}
      <Header />

      {/* <CardNav
      logo={logo}
      logoAlt="Aina logo"
      items={items}
      baseColor="#fff"
      menuColor="#000"
      buttonBgColor="#010D3F"
      buttonTextColor="#fff"
      ease="power3.out"
    />  */}

      <main className="relative isolate px-6 pt-14 lg:px-8 min-h-screen flex flex-col justify-center">
        <div className="mx-auto max-w-3xl text-center text-white">
          <BlurText
            text="Bienvenue dans votre espace CLIM-MAG : votre assistante Aïna  !"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-7xl mb-8"
          />
          <TypedText
          start={typedStart}
          text="Aïna est un agent IA polyvalent formé sur vos documents d'entreprise. Il vous aide à gérer vos modules, pour des réponses et décisions plus rapides et efficaces."
          speed={40}
          className="mt-8 text-lg sm:text-xl/8 text-gray-900 dark:text-white"
        />
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                modulesRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-md bg-white/20 backdrop-blur px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/30"
            >
              Commencer
            </a>
            <a href="#" className="font-semibold underline">
              En savoir plus →
            </a>
          </div>
        </div>
      </main>


      {/* ✅ Modules Section with SpotlightCard, text aligned left */}
      <section className="py-16 px-6 lg:px-12 font-sans" ref={modulesRef}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">

          {[
            { title: 'Aïna DOC', desc: 'Analyse de vos documents', img: '/src/assets/bot-doc.png' },
            { title: 'Aïna Financière', desc: 'Analyse & gestion financière', img: '/src/assets/bot-finance.png' },
            { title: 'Aïna Vision', desc: 'Vision et prédictions', img: '/src/assets/bot-vision.png' },
            { title: 'Aïna OCR', desc: 'Lecture et extraction de texte', img: '/src/assets/bot-OCR.png' },
          ].map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6, ease: 'easeOut' }}
            >
              <Link to={`/chat/${encodeURIComponent(module.title)}`}>
              <SpotlightCard imageSrc={module.img}>
                <h3 className="text-2xl font-bold text-white font-sans">{module.title}</h3>
                <p className="text-gray-300 mt-2 font-sans">{module.desc}</p>
              </SpotlightCard>
              </Link>
            </motion.div>
          ))}

        </div>
      </section>



    </div>


  );
}
