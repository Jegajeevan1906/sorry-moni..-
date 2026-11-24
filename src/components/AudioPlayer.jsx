import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

/**
 * Background music player for ./assets/bgm.mp3.
 * Unlocks audio silently during the swipe gesture and starts playing
 * automatically once the intro finishes (shouldPlay === true).
 */
export default function AudioPlayer({ shouldPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const userPausedRef = useRef(false);
  const shouldPlayRef = useRef(shouldPlay);
  const isMutedRef = useRef(isMuted);

  shouldPlayRef.current = shouldPlay;
  isMutedRef.current = isMuted;

  useEffect(() => {
    const audio = new Audio('./assets/bgm.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.55;
    audioRef.current = audio;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    // Unlock audio element synchronously inside the swipe/skip gesture
    const handleUnlock = () => {
      if (!audioRef.current || shouldPlayRef.current || userPausedRef.current) return;
      const target = audioRef.current;
      target.muted = true;
      target
        .play()
        .then(() => {
          if (!shouldPlayRef.current) {
            target.pause();
            target.currentTime = 0;
          }
          target.muted = isMutedRef.current;
        })
        .catch(() => {
          target.muted = isMutedRef.current;
        });
    };

    window.addEventListener('moni-unlock-bgm', handleUnlock);

    return () => {
      window.removeEventListener('moni-unlock-bgm', handleUnlock);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Automatically start playing as soon as the swipe intro completes
  useEffect(() => {
    if (!shouldPlay || userPausedRef.current || !audioRef.current) return;
    const audio = audioRef.current;
    audio.muted = isMutedRef.current;
    audio.play().catch(() => {
      // Fallback: if still blocked, start on next touch/click
      const resumeOnTap = () => {
        if (!userPausedRef.current && audioRef.current && audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        }
        window.removeEventListener('pointerdown', resumeOnTap);
        window.removeEventListener('touchstart', resumeOnTap);
      };
      window.addEventListener('pointerdown', resumeOnTap, { passive: true });
      window.addEventListener('touchstart', resumeOnTap, { passive: true });
    });
  }, [shouldPlay]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      userPausedRef.current = true;
      audio.pause();
    } else {
      userPausedRef.current = false;
      try {
        await audio.play();
      } catch {
        // Ignore playback rejection
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audio) {
      audio.muted = nextMuted;
    }
  };

  if (!shouldPlay) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.45rem 0.75rem',
        borderRadius: '999px',
        background: 'rgba(16, 25, 43, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(250, 204, 21, 0.25)',
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.4)',
      }}
      role="region"
      aria-label="Background music controls"
    >
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'transparent',
          border: 'none',
          color: '#f3ebdd',
          fontSize: '0.75rem',
          letterSpacing: '0.06em',
          cursor: 'pointer',
          padding: '0.2rem 0.35rem',
        }}
      >
        {isPlaying ? <Pause size={14} color="#facc15" /> : <Play size={14} color="#facc15" />}
        <span style={{ opacity: 0.9 }}>{isPlaying ? 'BGM On' : 'Play BGM'}</span>
      </button>

      {isPlaying && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            borderLeft: '1px solid rgba(243, 235, 221, 0.14)',
            paddingLeft: '0.45rem',
            color: isMuted ? 'rgba(243, 235, 221, 0.45)' : '#f3ebdd',
            cursor: 'pointer',
          }}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      )}
    </div>
  );
}
