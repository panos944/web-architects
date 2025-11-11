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
  const getInitialScrambled = () => {
    if (!text) return '';
    return text.split('').map(() => characters[Math.floor(Math.random() * characters.length)]).join('');
  };

  const [displayText, setDisplayText] = useState<string>(() => {
    // Initialize immediately with scrambled text if available
    if (text) {
      return text.split('').map(() => characters[Math.floor(Math.random() * characters.length)]).join('');
    }
    return '';
  });
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Ensure displayText is initialized when text is available or changes
  useEffect(() => {
    if (text) {
      // Always ensure we have scrambled text matching the text length
      const expectedLength = text.length;
      setDisplayText(prev => {
        // Only update if length doesn't match or is empty
        if (!prev || prev.length !== expectedLength) {
          return text.split('').map(() => characters[Math.floor(Math.random() * characters.length)]).join('');
        }
        return prev;
      });
    } else {
      setDisplayText('');
    }
  }, [text, characters]);

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      return;
    }

    const textLength = text.length;
    const updateInterval = 20; // Update every 50ms
    const scrambleInterval = 50; // Scramble characters every 100ms
    let scrambleTimeoutId: NodeJS.Timeout;
    let currentRevealedIndices = new Set<number>();

    const getRandomChar = () => {
      return characters[Math.floor(Math.random() * characters.length)];
    };

    const generateScrambledText = (revealedSet: Set<number>) => {
      let scrambled = '';
      for (let i = 0; i < textLength; i++) {
        if (revealedSet.has(i)) {
          scrambled += text[i];
        } else {
          scrambled += getRandomChar();
        }
      }
      return scrambled;
    };

    const decrypt = () => {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }

      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      if (sequential) {
        // Sequential reveal: characters reveal one by one
        const targetRevealed = Math.floor(progress * textLength);
        const newRevealedIndices = new Set<number>();
        
        for (let i = 0; i < targetRevealed; i++) {
          newRevealedIndices.add(i);
        }
        
        currentRevealedIndices = newRevealedIndices;
        setRevealedIndices(newRevealedIndices);
        setDisplayText(generateScrambledText(newRevealedIndices));

        if (progress < 1) {
          intervalRef.current = setTimeout(decrypt, updateInterval);
        } else {
          // Ensure final text is set correctly
          const allRevealed = new Set(Array.from({ length: textLength }, (_, i) => i));
          currentRevealedIndices = allRevealed;
          setDisplayText(text);
          setRevealedIndices(allRevealed);
        }
      } else {
        // Simultaneous reveal: all characters scramble together
        const revealedCount = Math.floor(progress * textLength);
        setDisplayText(generateScrambledText(new Set(Array.from({ length: revealedCount }, (_, i) => i))));

        if (progress < 1) {
          intervalRef.current = setTimeout(decrypt, updateInterval);
        } else {
          setDisplayText(text);
        }
      }
    };

    // Continuous scrambling effect for unrevealed characters
    const scramble = () => {
      if (currentRevealedIndices.size < textLength) {
        setDisplayText(generateScrambledText(currentRevealedIndices));
        scrambleTimeoutId = setTimeout(scramble, scrambleInterval);
      }
    };

    // Start decryption after delay
    const startDecryption = () => {
      startTimeRef.current = null;
      currentRevealedIndices = new Set();
      setRevealedIndices(new Set());
      setDisplayText(text.split('').map(() => getRandomChar()).join(''));
      decrypt();
      scramble();
    };

    if (delay > 0) {
      const delayTimeout = setTimeout(startDecryption, delay);
      return () => {
        clearTimeout(delayTimeout);
        if (intervalRef.current) clearTimeout(intervalRef.current);
        clearTimeout(scrambleTimeoutId);
      };
    } else {
      startDecryption();
      return () => {
        if (intervalRef.current) clearTimeout(intervalRef.current);
        clearTimeout(scrambleTimeoutId);
      };
    }
  }, [text, duration, delay, characters, sequential]);

  // Ensure we always have something to display - prioritize displayText, fallback to text
  const textToDisplay = displayText || (text ? text.split('').map(() => characters[Math.floor(Math.random() * characters.length)]).join('') : '');

  // Use regular span instead of motion.span to avoid gradient text rendering issues on mobile
  return (
    <span
      key={`decrypt-${text}`} // Force re-render when text changes
      className={className}
      style={{ display: 'inline-block' }}
    >
      {textToDisplay}
    </span>
  );
}

