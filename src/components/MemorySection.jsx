import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const MEMORY_FRAGMENTS = [
  'Random conversations',
  'Midnight phone calls',
  'Early morning exam wake-up calls',
  'Unexpected plans, food & walks',
];

export default function MemorySection() {
  const [imgError, setImgError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="memories"
      style={{
        position: 'relative',
        minHeight: '95vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(4.5rem, 9vw, 8rem) clamp(1.25rem, 5vw, 3.5rem)',
        background: 'linear-gradient(180deg, #14172b 0%, #10192b 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Warm desk lamp glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(250, 204, 21, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1120px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 'clamp(2.25rem, 5vw, 4.5rem)',
          alignItems: 'center',
        }}
      >
        {/* Text Column */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: 'rgba(250, 204, 21, 0.78)',
            }}
          >
            Scene 02 · The Memories
          </span>

          <h2
            className="font-serif-display"
            style={{
              fontSize: 'clamp(2rem, 4.2vw, 3.1rem)',
              fontWeight: 500,
              lineHeight: 1.15,
              color: '#f3ebdd',
            }}
          >
            The little things mattered.
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
              color: 'rgba(243, 235, 221, 0.84)',
              fontSize: 'clamp(0.96rem, 1.3vw, 1.06rem)',
              fontWeight: 300,
              lineHeight: 1.8,
            }}
          >
            <p>The random conversations.</p>
            <p>
              The late-night phone calls that somehow made midnight feel like afternoon.
            </p>
            <p>
              The early morning missed calls that were meant to wake someone up for exams.
            </p>
            <p>
              The unexpected plans, the food, the walks, and all those little moments that
              never needed a special occasion.
            </p>
            <p>Nothing extraordinary, perhaps.</p>
            <p>But somehow, they became memories I wouldn&apos;t mind revisiting.</p>
          </div>

          {/* Subtle Scrapbook Tags */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.55rem',
              marginTop: '0.25rem',
            }}
          >
            {MEMORY_FRAGMENTS.map((item) => (
              <span
                key={item}
                className="font-handwritten"
                style={{
                  fontSize: '1.05rem',
                  padding: '0.25rem 0.8rem',
                  borderRadius: '999px',
                  background: 'rgba(243, 235, 221, 0.06)',
                  border: '1px solid rgba(250, 204, 21, 0.2)',
                  color: 'rgba(243, 235, 221, 0.85)',
                }}
              >
                {item}
              </span>
            ))}
          </div>

          <p
            className="font-serif-display"
            style={{
              marginTop: '0.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(243, 235, 221, 0.12)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 1.8vw, 1.32rem)',
              color: '#fef08a',
              lineHeight: 1.5,
            }}
          >
            “Sometimes, the smallest moments make the longest memories.”
          </p>
        </motion.div>

        {/* Visual Frame */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
          style={{
            position: 'relative',
            borderRadius: '14px',
            overflow: 'hidden',
            aspectRatio: '4 / 3',
            backgroundColor: '#120c12',
            border: '1px solid rgba(243, 235, 221, 0.12)',
            boxShadow: '0 28px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          {!imgError ? (
            <motion.img
              src="./assets/midnight-calls.jpg"
              alt="Night-time desk with a warm lamp, phone, and alarm clock"
              loading="lazy"
              onError={() => setImgError(true)}
              initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 4.5, ease: 'easeOut' }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: 'brightness(0.92) contrast(1.04)',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(243, 235, 221, 0.5)',
              }}
            >
              02 · Midnight Calls
            </div>
          )}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(16, 25, 43, 0.1) 0%, rgba(18, 12, 18, 0.45) 100%)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

