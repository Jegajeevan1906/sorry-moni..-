import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

/**
 * Background music player for the uploaded instrumental track (./assets/bgm.mp3).
 * Attempts immediate playback on load and unlocks on the very first user gesture
 * if the browser's autoplay policy blocks unmuted audio before interaction.
 */
export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const userPausedRef = useRef(false);

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

    const tryPlay = () => {
      if (userPausedRef.current || !audioRef.current) return;
      audioRef.current.play().catch(() => {
        // Browser blocked unmuted autoplay; will unlock on first gesture below
      });
    };

    const handleFirstGesture = () => {
      if (!userPausedRef.current && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    tryPlay();
    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

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
