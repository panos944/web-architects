import { useEffect, useState, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  characters?: string;
  sequential?: boolean;
}

const DEFAULT_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export function DecryptedText({
  text,
  className = '',
  duration = 2,
  delay = 0,
  characters = DEFAULT_CHARACTERS,
  sequential = true,
}: DecryptedTextProps) {
  // Always start with actual text to ensure it renders
  const [displayText, setDisplayText] = useState<string>(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!text) return;

    // Prevent re-initialization on every render
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const textLength = text.length;
    const updateInterval = 30;
    let currentRevealedCount = 0;

    const getRandomChar = () => {
      return characters[Math.floor(Math.random() * characters.length)];
    };

    const generateScrambledText = (revealedCount: number) => {
      let result = '';
      for (let i = 0; i < textLength; i++) {
        if (i < revealedCount) {
          result += text[i];
        } else {
          result += getRandomChar();
        }
      }
      return result;
    };

    const animate = () => {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }

      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      currentRevealedCount = Math.floor(progress * textLength);
      
      if (progress < 1) {
        setDisplayText(generateScrambledText(currentRevealedCount));
        intervalRef.current = setTimeout(animate, updateInterval);
      } else {
        setDisplayText(text);
      }
    };

    // Start animation after delay
    const startAnimation = () => {
      startTimeRef.current = null;
      // Initialize with scrambled text
      setDisplayText(generateScrambledText(0));
      animate();
    };

    const delayTimeout = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(delayTimeout);
      if (intervalRef.current) clearTimeout(intervalRef.current);
      isInitializedRef.current = false;
    };
  }, [text, duration, delay, characters]);

  // Always render the text - even if empty, don't render null
  return (
    <span
      className={className}
      style={{ display: 'inline-block', minHeight: '1em' }}
    >
      {displayText || text}
    </span>
  );
}