import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronUp, Sparkles } from 'lucide-react';

const SWIPE_THRESHOLD_PX = 56;

export default function IntroAnimation({ onComplete }) {
  const shouldReduceMotion = useReducedMotion();

  // 'waiting' -> 'flash' (Phase 2: 2-3.2s) -> 'repaired' (Phase 3: 3.2-5s) -> 'exiting'
  const [phase, setPhase] = useState('waiting');
  const [dragOffset, setDragOffset] = useState(0);
  const [wandImgFailed, setWandImgFailed] = useState(false);

  const pointerStartRef = useRef(null);
  const canvasRef = useRef(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const triggerReparoSequence = () => {
    if (phaseRef.current !== 'waiting') return;
    setDragOffset(0);
    window.dispatchEvent(new Event('moni-unlock-bgm'));

    if (shouldReduceMotion) {
      setPhase('repaired');
      setTimeout(() => {
        onComplete();
      }, 900);
      return;
    }

    setPhase('flash');

    // Phase 3: Repaired calm state (~1.3s after swipe)
    setTimeout(() => {
      setPhase('repaired');
    }, 1250);

    // Smoothly transition into main story (~3.4s after swipe)
    setTimeout(() => {
      setPhase('exiting');
    }, 3200);

    setTimeout(() => {
      onComplete();
    }, 4000);
  };

  // Pointer handlers for both touch swipe (mobile) and mouse drag (desktop)
  const handlePointerDown = (e) => {
    if (phase !== 'waiting') return;
    // Ignore clicks on Skip button
    if (e.target.closest('[data-skip-intro="true"]')) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (phase !== 'waiting' || !pointerStartRef.current) return;
    const dy = pointerStartRef.current.y - e.clientY;
    const dx = Math.abs(pointerStartRef.current.x - e.clientX);

    if (dy > 0 && dy > dx) {
      const clamped = Math.min(dy, 160);
      setDragOffset(clamped);
      if (dy >= SWIPE_THRESHOLD_PX) {
        pointerStartRef.current = null;
        triggerReparoSequence();
      }
    }
  };

  const handlePointerUp = () => {
    pointerStartRef.current = null;
    if (phase === 'waiting') {
      setDragOffset(0);
    }
  };

  // Particle Canvas for Embers (Phase 1), Magic Dust Burst (Phase 2), and Golden Float (Phase 3)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || shouldReduceMotion) return;

    const ctx = canvas.getContext('2d');
    let rafId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const embers = Array.from({ length: 34 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.2 + 0.8,
      vy: -(Math.random() * 0.45 + 0.15),
      vx: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.55 + 0.15,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const burstDust = Array.from({ length: 75 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.6 + 0.8;
      return {
        x: width / 2,
        y: height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4,
        r: Math.random() * 2.5 + 0.8,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008,
      };
    });

    let burstInitialized = false;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const currentPhase = phaseRef.current;

      if (currentPhase === 'flash' && !burstInitialized) {
        burstInitialized = true;
        burstDust.forEach((p) => {
          p.x = width / 2 + (Math.random() - 0.5) * 24;
          p.y = height * 0.5 + (Math.random() - 0.5) * 140;
        });
      }

      // Ambient floating particles (red embers -> gold/emerald dust)
      for (const p of embers) {
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += 0.025;

        if (p.y < -12) {
          p.y = height + 12;
          p.x = Math.random() * width;
        }
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;

        const pulseAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));
        ctx.save();
        ctx.globalAlpha = pulseAlpha;
        if (currentPhase === 'waiting') {
          ctx.fillStyle = Math.random() > 0.25 ? '#dc2626' : '#f59e0b';
        } else if (currentPhase === 'flash') {
          ctx.fillStyle = '#fef08a';
        } else {
          ctx.fillStyle = p.r > 2 ? '#34d399' : '#fde047';
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Phase 2 magical dust burst
      if (currentPhase === 'flash' || currentPhase === 'repaired') {
        for (const d of burstDust) {
          if (d.alpha <= 0.02) continue;
          d.x += d.vx;
          d.y += d.vy;
          d.vx *= 0.985;
          d.vy *= 0.985;
          d.alpha = Math.max(0, d.alpha - d.decay);

          ctx.save();
          ctx.globalAlpha = d.alpha;
          ctx.fillStyle = d.r > 2 ? '#facc15' : '#fef08a';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [shouldReduceMotion]);

  const isRepairedOrExiting = phase === 'repaired' || phase === 'exiting';

  return (
    <motion.section
      aria-label="Cinematic Opening"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exiting' ? 0 : 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        touchAction: 'none',
        userSelect: 'none',
        cursor: phase === 'waiting' ? 'grab' : 'default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#120c12',
      }}
    >
      {/* Phase 1 Crimson/Ember Background */}
      <motion.div
        aria-hidden="true"
        animate={{
          opacity: isRepairedOrExiting ? 0 : 1,
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 62%, rgba(220, 38, 38, 0.24) 0%, rgba(127, 29, 29, 0.36) 35%, #120c12 80%)',
        }}
      />

      {/* Phase 1 Pulsing Ambient Glow */}
      {!shouldReduceMotion && phase === 'waiting' && (
        <motion.div
          aria-hidden="true"
          animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.06, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: 'min(520px, 90vw)',
            height: 'min(520px, 90vw)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.18) 0%, transparent 70%)',
            filter: 'blur(36px)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Phase 3 Midnight Navy + Deep Plum + Gold & Emerald Glow */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: isRepairedOrExiting ? 1 : 0 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 30% 25%, rgba(52, 211, 153, 0.14) 0%, transparent 50%), radial-gradient(circle at 72% 72%, rgba(253, 224, 71, 0.16) 0%, transparent 52%), linear-gradient(160deg, #10192b 0%, #181326 60%, #120c12 100%)',
        }}
      />

      {/* Atmospheric Particle Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Phase 2: Vertical Golden-Amber Split Seam */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={
          phase === 'flash'
            ? { scaleY: 1, opacity: [0, 1, 0.95] }
            : phase === 'repaired' || phase === 'exiting'
              ? { scaleY: 0, opacity: 0 }
              : { scaleY: 0, opacity: 0 }
        }
        transition={{ duration: phase === 'flash' ? 0.65 : 0.9, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '3px',
          transform: 'translateX(-50%)',
          transformOrigin: 'bottom center',
          background: 'linear-gradient(180deg, transparent 0%, #facc15 25%, #fef08a 50%, #f59e0b 80%, transparent 100%)',
          boxShadow: '0 0 28px 6px rgba(250, 204, 21, 0.65), 0 0 65px 14px rgba(245, 158, 11, 0.35)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />

      {/* Phase 2: Reparo Radial Flash */}
      <motion.div
        aria-hidden="true"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={
          phase === 'flash'
            ? { scale: [0.2, 1.8, 2.5], opacity: [0, 0.55, 0] }
            : { scale: 0.2, opacity: 0 }
        }
        transition={{ duration: 1.15, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width: '70vmax',
          height: '70vmax',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(254, 240, 138, 0.55) 0%, rgba(250, 204, 21, 0.22) 35%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* Skip Intro Button */}
      <button
        type="button"
        data-skip-intro="true"
        onClick={() => {
          window.dispatchEvent(new Event('moni-unlock-bgm'));
          onComplete();
        }}
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 20,
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(248, 250, 252, 0.16)',
          borderRadius: '999px',
          padding: '0.45rem 0.95rem',
          color: 'rgba(248, 250, 252, 0.78)',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
        }}
      >
        Skip Intro
      </button>

      {/* Center Frosted-Glass Card */}
      <motion.div
        animate={{
          y: phase === 'waiting' ? -dragOffset * 0.18 : 0,
          borderColor:
            phase === 'flash'
              ? 'rgba(250, 204, 21, 0.85)'
              : isRepairedOrExiting
                ? 'rgba(52, 211, 153, 0.45)'
                : 'rgba(248, 250, 252, 0.14)',
          boxShadow:
            phase === 'flash'
              ? '0 0 45px rgba(250, 204, 21, 0.35), inset 0 0 24px rgba(254, 240, 138, 0.15)'
              : isRepairedOrExiting
                ? '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 36px rgba(52, 211, 153, 0.14)'
                : '0 24px 60px rgba(0, 0, 0, 0.65)',
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: 'min(340px, 84vw)',
          padding: '2.75rem 2rem',
          borderRadius: '20px',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(248, 250, 252, 0.14)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.9rem',
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: isRepairedOrExiting ? '#34d399' : 'rgba(243, 235, 221, 0.58)',
            transition: 'color 0.6s ease',
          }}
        >
          {isRepairedOrExiting ? 'Reparo' : 'Dedicated to Monika'}
        </span>

        <motion.h1
          className="font-serif-display"
          animate={{
            color: phase === 'flash' ? '#fef08a' : '#f8fafc',
            textShadow:
              phase === 'flash'
                ? '0 0 28px rgba(254, 240, 138, 0.85)'
                : isRepairedOrExiting
                  ? '0 0 20px rgba(253, 224, 71, 0.4)'
                  : '0 0 18px rgba(248, 250, 252, 0.28)',
          }}
          transition={{ duration: 0.45 }}
          style={{
            fontSize: 'clamp(2.35rem, 6vw, 3.1rem)',
            fontWeight: 500,
            letterSpacing: '0.22em',
            lineHeight: 1.1,
            marginLeft: '0.22em',
          }}
        >
          {isRepairedOrExiting ? 'MENDED' : 'SWIPE'}
        </motion.h1>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'rgba(243, 235, 221, 0.68)',
            fontWeight: 300,
            maxWidth: '24ch',
            lineHeight: 1.5,
          }}
        >
          {isRepairedOrExiting
            ? 'Somewhere Between Then & Now'
            : 'Glide upward with the wand to mend the silence'}
        </p>

        {/* Animated Swipe Area with Centered Elder Wand */}
        {phase === 'waiting' && (
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              marginTop: '0.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              color: '#facc15',
            }}
          >
            <ChevronUp size={18} />
            <span
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(250, 204, 21, 0.8)',
              }}
            >
              Swipe Up
            </span>
          </motion.div>
        )}

        {/* Elder Wand + Luminous Golden Trail inside the Center Swipe Area */}
        <motion.div
          aria-hidden="true"
          animate={
            phase === 'waiting'
              ? { y: -dragOffset * 0.55, opacity: 1 }
              : phase === 'flash'
                ? { y: -window.innerHeight * 0.45, opacity: [1, 1, 0.25] }
                : { y: -window.innerHeight * 0.55, opacity: 0 }
          }
          transition={
            phase === 'waiting'
              ? { type: 'spring', stiffness: 300, damping: 28 }
              : { duration: 1.05, ease: 'easeInOut' }
          }
          style={{
            position: 'relative',
            zIndex: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
            marginTop: '0.15rem',
          }}
        >
          {/* Golden Trail Behind Wand */}
          <motion.div
            animate={{
              height: phase === 'flash' ? 220 : dragOffset > 12 ? 72 : 0,
              opacity: phase === 'flash' ? 0.95 : dragOffset > 12 ? 0.65 : 0,
            }}
            transition={{ duration: 0.35 }}
            style={{
              position: 'absolute',
              top: '24px',
              width: '4px',
              borderRadius: '999px',
              background: 'linear-gradient(180deg, #fef08a 0%, #facc15 45%, #f59e0b 100%)',
              boxShadow: '0 0 22px 6px rgba(250, 204, 21, 0.65)',
            }}
          />

          {/* Wand Tip Glow */}
          <motion.div
            animate={{
              scale: phase === 'flash' ? 2.4 : 1 + dragOffset / 160,
              opacity: phase === 'flash' ? 1 : 0.7,
            }}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fef08a 0%, #facc15 55%, transparent 100%)',
              boxShadow: '0 0 18px 5px rgba(250, 204, 21, 0.55)',
              marginBottom: '-6px',
              zIndex: 2,
            }}
          />

          {!wandImgFailed ? (
            <img
              src="./assets/elder-wand.png"
              alt=""
              onError={() => setWandImgFailed(true)}
              style={{
                height: 'clamp(120px, 20vh, 175px)',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 12px rgba(250, 204, 21, 0.28))',
              }}
            />
          ) : (
            /* Clean SVG Elder Wand Fallback */
            <svg
              width="28"
              height="150"
              viewBox="0 0 28 170"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 4L16 38C18 42 18 48 15.5 52L16.5 76C19 80 19 87 16.5 91L17.5 118C20 123 20 131 17 136L18 166H10L11 136C8 131 8 123 10.5 118L11.5 91C9 87 9 80 11.5 76L12.5 52C10 48 10 42 12 38L14 4Z"
                fill="url(#wandGrad)"
                stroke="#5c4033"
                strokeWidth="0.8"
              />
              <defs>
                <linearGradient id="wandGrad" x1="14" y1="4" x2="14" y2="166" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4a3225" />
                  <stop offset="0.5" stopColor="#2b1b13" />
                  <stop offset="1" stopColor="#1c110b" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </motion.div>

        {isRepairedOrExiting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ color: '#fde047', marginTop: '0.25rem' }}
          >
            <Sparkles size={18} />
          </motion.div>
        )}
      </motion.div>

      {/* Accessible click fallback for keyboard / reduced-motion users */}
      {phase === 'waiting' && (
        <button
          type="button"
          onClick={triggerReparoSequence}
          aria-label="Activate Reparo transition"
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            right: '1.25rem',
            zIndex: 20,
            background: 'transparent',
            border: 'none',
            color: 'rgba(248, 250, 252, 0.38)',
            fontSize: '0.7rem',
            cursor: 'pointer',
          }}
        >
          Tap if swipe unavailable
        </button>
      )}
    </motion.section>
  );
}

