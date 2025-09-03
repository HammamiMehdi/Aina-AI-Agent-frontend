import React, { useRef, useState } from 'react';




// interface Position {
//     x: number;
//     y: number;
//   }
  
  interface SpotlightCardProps extends React.PropsWithChildren {
    className?: string;
    spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
    imageSrc?: string; // new prop for card image
  }
  
  const SpotlightCard: React.FC<SpotlightCardProps> = ({
    children,
    className = '',
    spotlightColor = 'rgba(255, 255, 255, 0.25)',
    imageSrc
  }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState<number>(0);
    const [hovered, setHovered] = useState<boolean>(false);
  
    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
      if (!divRef.current || isFocused) return;
      const rect = divRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
  
    const handleFocus = () => {
      setIsFocused(true);
      setOpacity(0.6);
    };
    const handleBlur = () => {
      setIsFocused(false);
      setOpacity(0);
    };
    const handleMouseEnter = () => {
      setHovered(true);
      setOpacity(0.6);
    };
    const handleMouseLeave = () => {
      setHovered(false);
      setOpacity(0);
    };
  
    return (
        <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative rounded-3xl border border-neutral-800 
          bg-neutral-900/30 backdrop-blur-md overflow-hidden p-8 min-h-[350px] flex flex-col justify-between 
          w-[300px]  // <- fixed width
          ${className}`}
      >
        {/* Spotlight effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
          style={{
            opacity,
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
          }}
        />
  
        {/* Card content */}
        <div className="flex flex-col justify-end h-full text-left z-10 relative">
          {children}
        </div>
  
        {/* Hover image */}
        {imageSrc && (
        //   <img
        //     src={imageSrc}
        //     alt="Card visual"
        //     className={`absolute right-0 bottom-0 h-[360px] w-auto transform transition-transform duration-500 ease-in-out 
        //       ${hovered ? 'translate-x-8 translate-y-[-20px] scale-105' : 'translate-x-20 translate-y-4 scale-90'}
        //       pointer-events-none`}
        //   />

        <img
        src={imageSrc}
        alt="Card visual"
        className={`absolute right-0 bottom-0 h-[260px] w-auto transform transition-transform duration-500 ease-in-out 
          ${hovered ? 'translate-x-10 translate-y-[-80px] scale-115' : 'translate-x-36 translate-y-0 scale-100'}
          pointer-events-none`}
      />
        )}
      </div>
    );
  };
  
  export default SpotlightCard;