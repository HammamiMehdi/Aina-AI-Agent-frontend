// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import { Bars3Icon, CurrencyDollarIcon, DocumentTextIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline'
// import ThemeToggle from '../ThemeToggle/ThemeToggle'
// import { Link } from 'react-router-dom'
// import useMeasure from 'react-use-measure'
// import { useAnimate, useDragControls, useMotionValue, motion } from 'framer-motion'

// // ──────────────────────────────────────────────
// // Liste des agents
// // ──────────────────────────────────────────────
// interface NavItem {
//   name: string
//   href: string
//   icon?: React.ReactNode
//   description: string
//   skills: string[]
//   experience: string[]
// }

// const navigation: NavItem[] = [
//   {
//     name: 'Aïna DOC',
//     href: '/chat/Aïna DOC',
//     icon: <DocumentTextIcon className="h-5 w-5 mr-2 inline" />,
//     description:
//       "Spécialiste de la gestion documentaire et de la recherche d’informations dans vos données internes.",
//     skills: ['Analyse de documents', 'Synthèse rapide', 'Recherche intelligente'],
//     experience: ['3 ans d’expérience en traitement de données textuelles'],
//   },
//   {
//     name: 'Aïna Finance',
//     href: '/chat/Aïna Finance',
//     icon: <CurrencyDollarIcon className="h-5 w-5 mr-2 inline" />,
//     description:
//       'Expert en analyse financière et génération de rapports en temps réel.',
//     skills: ['Reporting financier', 'Prévisions', 'Analyse des coûts'],
//     experience: ['2 ans d’assistance aux directions financières'],
//   },
//   {
//     name: 'Aïna Vision',
//     href: '/chat/Aïna Vision',
//     icon: <EyeIcon className="h-5 w-5 mr-2 inline" />,
//     description:
//       'Capable d’interpréter des images et d’extraire des informations clés pour vos besoins visuels.',
//     skills: ['Analyse d’images', 'Reconnaissance d’objets', 'Vision par IA'],
//     experience: ['2 ans en traitement d’images industrielles'],
//   },
// ]

// // ──────────────────────────────────────────────
// // Popup Drawer
// // ──────────────────────────────────────────────
// interface DrawerProps {
//   open: boolean
//   setOpen: (v: boolean) => void
//   children: React.ReactNode
// }

// const DragCloseDrawer = ({ open, setOpen, children }: DrawerProps) => {
//   const [scope, animate] = useAnimate()
//   const [drawerRef, { height }] = useMeasure()
//   const y = useMotionValue(0)
//   const controls = useDragControls()

//   const handleClose = async () => {
//     animate(scope.current, { opacity: [1, 0] })
//     const yStart = typeof y.get() === 'number' ? y.get() : 0
//     await animate('#drawer', { y: [yStart, height] })
//     setOpen(false)
//   }

//   return (
//     <>
//       {open && (
//         <motion.div
//           ref={scope}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           onClick={handleClose}
//           className="fixed inset-0 z-50 bg-neutral-950/70"
//         >
//           <motion.div
//             id="drawer"
//             ref={drawerRef}
//             onClick={(e) => e.stopPropagation()}
//             initial={{ y: '100%' }}
//             animate={{ y: '0%' }}
//             transition={{ ease: 'easeInOut' }}
//             className="absolute bottom-0 h-[75vh] w-full overflow-hidden rounded-t-3xl bg-neutral-900 text-neutral-200"
//             style={{ y }}
//             drag="y"
//             dragControls={controls}
//             dragListener={false}
//             dragConstraints={{ top: 0, bottom: 0 }}
//             dragElastic={{ top: 0, bottom: 0.5 }}
//             onDragEnd={() => {
//               if (y.get() >= 100) handleClose()
//             }}
//           >
//             <div className="absolute left-0 right-0 top-0 z-10 flex justify-center bg-neutral-900 p-4">
//               <button
//                 onPointerDown={(e) => controls.start(e)}
//                 className="h-2 w-14 cursor-grab touch-none rounded-full bg-neutral-700 active:cursor-grabbing"
//               ></button>
//             </div>
//             <div className="relative z-0 h-full overflow-y-auto p-6 pt-12">
//               {children}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </>
//   )
// }

// // ──────────────────────────────────────────────
// // Header avec popup agent
// // ──────────────────────────────────────────────
// export default function Header() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [openDrawer, setOpenDrawer] = useState(false)
//   const [selectedAgent, setSelectedAgent] = useState<NavItem | null>(null)

//   const logoRef = useRef<HTMLImageElement>(null)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (logoRef.current) {
//         logoRef.current.classList.remove('animate-logo')
//         void logoRef.current.offsetWidth
//         logoRef.current.classList.add('animate-logo')
//       }
//     }, 20000)
//     if (logoRef.current) logoRef.current.classList.add('animate-logo')
//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <header className="absolute inset-x-0 top-0 z-50">
//       <nav className="flex items-center justify-between p-6 lg:px-8">
//         {/* Logo */}
//         <div className="flex lg:flex-1 items-center space-x-2">
//           <Link to="/" className="flex items-center -m-1.5 p-1.5 space-x-4">
//             <span className="sr-only">Aïna AI Agent</span>
//             <img
//               ref={logoRef}
//               alt="Logo Aïna"
//               src="/aina-clim-mag-v8.png"
//               className="h-12 w-auto"
//             />
//           </Link>
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden lg:flex lg:gap-x-12">
//           {navigation.map((item) => (
//             <button
//               key={item.name}
//               onClick={() => {
//                 setSelectedAgent(item)
//                 setOpenDrawer(true)
//               }}
//               className="text-gray-900 dark:text-white font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center"
//             >
//               {item.icon}
//               {item.name}
//             </button>
//           ))}
//         </div>

//         {/* Right side */}
//         <div className="flex items-center gap-4">
//           <ThemeToggle />
//           <div className="lg:hidden">
//             <button
//               onClick={() => setMobileMenuOpen(true)}
//               className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
//             >
//               <Bars3Icon className="h-6 w-6" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Popup Agent Drawer */}
//       <DragCloseDrawer open={openDrawer} setOpen={setOpenDrawer}>
//         {selectedAgent && (
//           <div className="mx-auto max-w-2xl space-y-4">
//             <h2 className="text-3xl font-bold text-indigo-400">{selectedAgent.name}</h2>
//             <p className="text-neutral-300">{selectedAgent.description}</p>

//             <div>
//               <h3 className="text-xl font-semibold text-neutral-200 mb-2">Compétences</h3>
//               <ul className="list-disc list-inside text-neutral-400 space-y-1">
//                 {selectedAgent.skills.map((skill, idx) => (
//                   <li key={idx}>{skill}</li>
//                 ))}
//               </ul>
//             </div>

//             <div>
//               <h3 className="text-xl font-semibold text-neutral-200 mb-2">Expérience</h3>
//               <ul className="list-disc list-inside text-neutral-400 space-y-1">
//                 {selectedAgent.experience.map((exp, idx) => (
//                   <li key={idx}>{exp}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </DragCloseDrawer>

//       {/* Mobile Menu (basique) */}
//       {mobileMenuOpen && (
//         <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 lg:hidden">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => setMobileMenuOpen(false)}
//               className="rounded-md p-2.5 text-gray-700 dark:text-gray-200"
//             >
//               <XMarkIcon className="h-6 w-6" />
//             </button>
//           </div>
//           <div className="mt-6 space-y-2">
//             {navigation.map((item) => (
//               <button
//                 key={item.name}
//                 onClick={() => {
//                   setSelectedAgent(item)
//                   setOpenDrawer(true)
//                   setMobileMenuOpen(false)
//                 }}
//                 className="flex items-center rounded-lg px-3 py-2 text-gray-900 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
//               >
//                 {item.icon}
//                 {item.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </header>
//   )
// }
"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bars3Icon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useMsal, useAccount, useIsAuthenticated } from "@azure/msal-react";
import AgentModal from "../AgentModal/AgentModal";

// Navigation
interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  image: string; // ✅ nouvelle propriété pour l'image de l'agent
  description:  React.ReactNode;
}
const navigation: NavItem[] = [
  {
    name: "Aïna DOC",
    href: "/chat/Aïna DOC",
    icon: <DocumentTextIcon className="h-5 w-5 mr-1 inline" />,
    image: "/bot-doc.png",
    description: (
      <>
        📄 <strong>Aïna DOC</strong> permet de <strong>rechercher, analyser et résumer</strong> vos <strong>documents</strong> en langage naturel. 
        Obtenez en quelques secondes les <strong>informations clés</strong>, sans avoir à parcourir chaque page.
      </>
    ),
  },
  {
    name: "Aïna Finance",
    href: "/chat/Aïna Finance",
    icon: <CurrencyDollarIcon className="h-5 w-5 mr-2 inline" />,
    image: "/bot-finance.png",
    description: (
      <>
        💰 <strong>Aïna Finance</strong> transforme vos <strong>données financières</strong> en <strong>insights clairs et actionnables</strong>. 
        Suivez vos <strong>indicateurs clés</strong>, identifiez les <strong>tendances</strong> et prenez des <strong>décisions stratégiques</strong> en temps réel.
      </>
    ),
  },
  {
    name: "Aïna Vision",
    href: "/chat/Aïna Vision",
    icon: <EyeIcon className="h-5 w-5 mr-2 inline" />,
    image: "/bot-vision.png",
    description: (
      <>
        👁️ <strong>Aïna Vision</strong> analyse vos <strong>images et photos</strong> pour en extraire des <strong>détails précis</strong>. 
        Détection d’objets, <strong>reconnaissance visuelle</strong> et extraction d’<strong>informations contextuelles</strong> en un instant.
      </>
    ),
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
   const [selectedAgent, setSelectedAgent] = useState<NavItem | null>(null);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);


  // MSAL Hooks
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const isAuthenticated = useIsAuthenticated();
  //const navigate = useNavigate();

  // Handle agent selection: Login if needed, then navigate
  const handleAgentSelect = (item: NavItem) => {
    //navigate(item.href);
    setMobileMenuOpen(false);
    setSelectedAgent(item);
    setIsAgentModalOpen(true);
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false); // Close dropdown before logout
    instance.logoutPopup({
      mainWindowRedirectUri: "/", // Redirect to home after logout
    });
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1 items-center space-x-2">
          <Link to="/" className="flex items-center -m-1.5 p-1.5 space-x-4">
            <img
              ref={logoRef}
              alt="Logo Aïna"
              src="/aina-clim-mag-v8.png"
              className="h-12 w-auto"
            />
            <img
              alt="Logo partenaire"
              src="/aina-clim-mag-v9-light.png"
              className="h-12 w-auto block dark:hidden"
            />
            <img
              alt="Logo partenaire dark"
              src="/aina-clim-mag-v9.png"
              className="h-12 w-auto hidden dark:block"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-4">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => handleAgentSelect(item)}
              className="bg-transparent hover:bg-transparent text-gray-900 dark:text-white 
                         font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 
                         transition flex items-center focus:outline-none"
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </div>

        {/* Auth Status + Theme + Mobile menu */}
        <div className="flex items-center gap-4">
  {isAuthenticated && account ? (
    <div
      className="hidden lg:flex items-center gap-3 relative"
      ref={dropdownRef}
    >
      {/* Bouton avatar + nom */}
      <button
        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        className="bg-transparent flex items-center gap-2 focus:outline-none"
        aria-label="Open user menu"
      >
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {account.name}
        </span>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
          {account.idTokenClaims?.picture &&
          typeof account.idTokenClaims.picture === "string" ? (
            <img
              src={account.idTokenClaims.picture}
              alt={account.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-indigo-700 dark:text-indigo-300 font-medium">
              {account.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </button>

      {/* ✅ Nouveau Dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="absolute right-0 mt-60 w-72 max-w-xs
                     bg-white dark:bg-gray-900
                     border border-gray-200 dark:border-gray-700
                     rounded-xl overflow-hidden
                     shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.04)]
                     hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_15px_15px_-6px_rgba(0,0,0,0.06)]
                     transition-all duration-300 z-20"
        >
          {/* Header */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700
                          bg-gradient-to-r from-blue-700 to-blue-600">
            <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">
              Connecter en tant que
            </p>
            <div className="flex items-center mt-1">
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-white truncate">
                {account.username}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="py-1.5">
            
            {/* ThemeToggle à l'intérieur ✅ */}
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Thème
              </span>
              <ThemeToggle />
            </div>

            {/* Logout */}
            <button
  onClick={handleLogout}
  className="group relative w-full flex items-center px-4 py-2.5 text-sm bg-transparent
             text-gray-700  dark:text-gray-200
             hover:bg-red-100 dark:hover:bg-red-800
             transition-all duration-200"
>
  {/* Bordure gauche */}
  <div
    className="absolute left-0 top-0 h-full w-1
               bg-red-500 dark:bg-red-400
               rounded-r opacity-0 group-hover:opacity-100
               transition-all duration-200"
  />

  {/* Icône */}
  <div
    className="w-8 h-8 rounded-lg
               bg-red-100 dark:bg-red-700
               flex items-center justify-center mr-3
               group-hover:bg-red-200 dark:group-hover:bg-red-600
               transition-colors duration-200"
  >
    <svg
      fill="currentColor"
      viewBox="0 0 20 20"
      className="h-5 w-5
                 text-red-500 dark:text-red-300
                 group-hover:text-red-600 dark:group-hover:text-red-200"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
      />
    </svg>
  </div>

  {/* Texte */}
  <span
    className="font-medium
               text-red-600 dark:text-red-300
               group-hover:text-red-700 dark:group-hover:text-red-200"
  >
    Déconnexion
  </span>
</button>

          </div>
        </div>
      )}
    </div>
  ) : null}

  {/* Menu mobile */}
  <div className="lg:hidden">
    <button
      onClick={() => setMobileMenuOpen(true)}
      className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
    >
      <Bars3Icon className="h-6 w-6" />
    </button>
  </div>
</div>

      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 lg:hidden">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <img
                alt="Aïna AI Agent Logo"
                src="/logo-blue.png"
                className="h-10 w-auto"
              />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-6 space-y-2">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleAgentSelect(item)}
                className="flex items-center rounded-lg px-3 py-2 text-gray-900 dark:text-white 
                           font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
              >
                {item.icon}
                {item.name}
              </button>
            ))}

            {/* Mobile Auth Section */}
            {isAuthenticated && account ? (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-2 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      {account.idTokenClaims?.picture &&
                      typeof account.idTokenClaims.picture === "string" ? (
                        <img
                          src={account.idTokenClaims.picture} // ✅ Now TypeScript knows this is a string
                          alt={account.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                          {account.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {account.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
       <AgentModal
  isOpen={isAgentModalOpen}
  onClose={() => setIsAgentModalOpen(false)}
  agent={
    selectedAgent
      ? {
          name: selectedAgent.name,
          image: selectedAgent.image,
          description: selectedAgent.description!,
          href: selectedAgent.href,   // ✅ Passer le lien
        }
      : null
  }
/>
    </header>
  );
}
