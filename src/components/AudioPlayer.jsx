import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

/**
 * Gentle procedural ambient soundscape using Web Audio API.
 * Never autoplays with sound; user explicitly toggles play/pause and mute.
 */
export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const intervalRef = useRef(null);
  const activeNodesRef = useRef([]);

  const stopAmbientLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    activeNodesRef.current.forEach((node) => {
      try {
        node.stop();
        node.disconnect();
      } catch {
        // Ignore already stopped oscillators
      }
    });
    activeNodesRef.current = [];
  };

  const playNote = (ctx, masterGain, freq, duration = 6, gainAmount = 0.045) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(gainAmount, now + 1.8);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
    activeNodesRef.current.push(osc);

    osc.onended = () => {
      activeNodesRef.current = activeNodesRef.current.filter((n) => n !== osc);
    };
  };

  const startAmbient = async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtxRef.current) {
      const ctx = new AudioContextClass();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.7, ctx.currentTime);
      masterGain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Warm nostalgic progression: Dmaj9 -> Bm7 -> Gmaj9 -> Asus4
    const chords = [
      [146.83, 220.0, 277.18, 329.63],
      [123.47, 220.0, 293.66, 369.99],
      [98.0, 196.0, 246.94, 329.63],
      [110.0, 220.0, 293.66, 329.63],
    ];
    let step = 0;

    const triggerChord = () => {
      if (!audioCtxRef.current || !masterGainRef.current) return;
      const chord = chords[step % chords.length];
      chord.forEach((freq, idx) => {
        setTimeout(() => {
          if (audioCtxRef.current && masterGainRef.current) {
            playNote(audioCtxRef.current, masterGainRef.current, freq, 6.5, 0.035);
          }
        }, idx * 240);
      });
      step += 1;
    };

    triggerChord();
    intervalRef.current = setInterval(triggerChord, 5600);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAmbientLoop();
      setIsPlaying(false);
    } else {
      startAmbient();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        nextMuted ? 0 : 0.7,
        audioCtxRef.current.currentTime,
        0.15
      );
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientLoop();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.4rem 0.65rem',
        borderRadius: '999px',
        background: 'rgba(16, 25, 43, 0.78)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(243, 235, 221, 0.14)',
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.35)',
      }}
      role="region"
      aria-label="Ambient audio controls"
    >
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause ambient score' : 'Play ambient score'}
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
        <span style={{ opacity: 0.85 }}>{isPlaying ? 'Score On' : 'Score'}</span>
      </button>

      {isPlaying && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute ambient score' : 'Mute ambient score'}
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

