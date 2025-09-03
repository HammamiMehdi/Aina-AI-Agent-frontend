import { useState, useEffect } from "react";

interface TypedTextProps {
    text: string;
    speed?: number; // ms per character
    start?: boolean; // when true, start typing
    className?: string;
  }
  
  export default function TypedText({ text, speed = 50, start = false, className }: TypedTextProps) {
    const [displayedText, setDisplayedText] = useState('');
  
    useEffect(() => {
      if (!start) return;
  
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        if (index === text.length) clearInterval(interval);
      }, speed);
  
      return () => clearInterval(interval);
    }, [start, text, speed]);
  
    return <p className={className}>{displayedText}</p>;
  }