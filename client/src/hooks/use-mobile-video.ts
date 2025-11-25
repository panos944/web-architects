import { useEffect, useRef } from 'react';

export function useMobileVideoAutoplay() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = async () => {
      try {
        await video.play();
      } catch (error) {
        // Auto-play was prevented
        if (!hasInteracted.current) {
          const handleInteraction = async () => {
            try {
              await video.play();
              hasInteracted.current = true;
              document.removeEventListener('touchstart', handleInteraction);
              document.removeEventListener('click', handleInteraction);
            } catch {
              // Video play failed - autoplay may be blocked
            }
          };

          document.addEventListener('touchstart', handleInteraction, { once: true });
          document.addEventListener('click', handleInteraction, { once: true });
        }
      }
    };

    // Try to play when video data is loaded
    video.addEventListener('loadeddata', handlePlay);
    video.addEventListener('canplay', handlePlay);

    // Also try to play immediately if the video is already loaded
    if (video.readyState >= 3) {
      handlePlay();
    }

    return () => {
      video.removeEventListener('loadeddata', handlePlay);
      video.removeEventListener('canplay', handlePlay);
    };
  }, []);

  return videoRef;
}