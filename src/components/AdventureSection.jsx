import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function AdventureSection() {
  const [imgError, setImgError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="adventure"
      style={{
        position: 'relative',
        minHeight: '95vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(4.5rem, 9vw, 8rem) clamp(1.25rem, 5vw, 3.5rem)',
        background: 'linear-gradient(180deg, #10192b 0%, #16182c 100%)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1120px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(2rem, 4vw, 3rem)',
        }}
      >
        {/* Wide Cinematic Frame */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            maxHeight: '520px',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#120c12',
            border: '1px solid rgba(243, 235, 221, 0.14)',
            boxShadow: '0 28px 65px rgba(0, 0, 0, 0.52)',
          }}
        >
          {!imgError ? (
            <motion.img
              src="/assets/cinematic-road.jpg"
              alt="Scenic mountain road at golden hour sunset"
              loading="lazy"
              onError={() => setImgError(true)}
              initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.07 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 5, ease: 'easeOut' }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
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
              06 · The Adventure
            </div>
          )}

          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(16, 25, 43, 0.08) 25%, rgba(16, 25, 43, 0.72) 100%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: 'clamp(1.25rem, 3vw, 2.25rem)',
              left: 'clamp(1.25rem, 3vw, 2.25rem)',
              right: '1.25rem',
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: '0.72rem',
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: 'rgba(250, 204, 21, 0.88)',
                marginBottom: '0.45rem',
              }}
            >
              Scene 06 · The Adventure
            </span>
            <h2
              className="font-serif-display"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.3rem)',
                fontWeight: 500,
                color: '#f8fafc',
                lineHeight: 1.1,
              }}
            >
              There is still a world outside.
            </h2>
          </div>
        </motion.div>

        {/* Narrative Content */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, delay: 0.1, ease: 'easeOut' }}
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            color: 'rgba(243, 235, 221, 0.85)',
            fontSize: 'clamp(0.98rem, 1.35vw, 1.08rem)',
            fontWeight: 300,
            lineHeight: 1.85,
          }}
        >
          <p>We haven&apos;t explored enough places.</p>
          <p>
            There are roads we haven&apos;t travelled, cafés we haven&apos;t visited,
            photographs we haven&apos;t taken, and stories we haven&apos;t collected.
          </p>
          <p>Maybe someday, there could be a random trip.</p>
          <p>A place neither of us has visited.</p>
          <p>A long conversation during a journey.</p>
          <p>A new memory without having to explain the old ones.</p>
          <p>No grand plans. No promises.</p>
          <p>Just two friends, a little time, and somewhere new to go.</p>

          <p
            className="font-serif-display"
            style={{
              marginTop: '0.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(243, 235, 221, 0.14)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.15rem, 2vw, 1.4rem)',
              color: '#fef08a',
              lineHeight: 1.5,
            }}
          >
            “Because perhaps the best memories are not always behind us. Some are still
            waiting somewhere ahead.”
          </p>
        </motion.div>
      </div>
    </section>
  );
}

