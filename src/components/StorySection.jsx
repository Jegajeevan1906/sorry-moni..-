import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function StorySection({
  id,
  chapterNumber,
  label,
  heading,
  paragraphs = [],
  closingLine,
  imageSrc,
  imageAlt,
  variant = 'editorial',
  reverse = false,
}) {
  const [imgError, setImgError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const bgMap = {
    editorial: 'linear-gradient(180deg, #10192b 0%, #14172b 100%)',
    mist: 'linear-gradient(180deg, #10192b 0%, #0d1322 55%, #181326 100%)',
    keepsake: 'linear-gradient(180deg, #181326 0%, #141220 100%)',
  };

  return (
    <section
      id={id}
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(4.5rem, 9vw, 8rem) clamp(1.25rem, 5vw, 3.5rem)',
        background: bgMap[variant] || bgMap.editorial,
        overflow: 'hidden',
      }}
    >
      {/* Subtle atmospheric glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            variant === 'mist'
              ? 'radial-gradient(circle at 25% 30%, rgba(52, 211, 153, 0.06) 0%, transparent 55%)'
              : 'radial-gradient(circle at 75% 25%, rgba(250, 204, 21, 0.06) 0%, transparent 55%)',
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
        {/* Visual Frame */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            order: reverse ? 2 : 1,
            position: 'relative',
            borderRadius: '14px',
            overflow: 'hidden',
            aspectRatio: '4 / 3',
            backgroundColor: '#120c12',
            border: '1px solid rgba(243, 235, 221, 0.12)',
            boxShadow: '0 28px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          {!imgError && imageSrc ? (
            <motion.img
              src={imageSrc}
              alt={imageAlt}
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
                filter:
                  variant === 'mist'
                    ? 'brightness(0.84) contrast(1.06) saturate(0.85)'
                    : 'brightness(0.92) contrast(1.03)',
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
                background:
                  'radial-gradient(circle at center, rgba(250, 204, 21, 0.08), #120c12 75%)',
                color: 'rgba(243, 235, 221, 0.45)',
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </div>
          )}

          {/* Cinematic vignette */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(16, 25, 43, 0.12) 0%, rgba(18, 12, 18, 0.45) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Chapter tag */}
          <span
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              padding: '0.3rem 0.7rem',
              borderRadius: '999px',
              background: 'rgba(16, 25, 43, 0.72)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(243, 235, 221, 0.14)',
              fontSize: '0.68rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(243, 235, 221, 0.8)',
            }}
          >
            {chapterNumber} · {label}
          </span>
        </motion.div>

        {/* Narrative Text */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, delay: 0.1, ease: 'easeOut' }}
          style={{
            order: reverse ? 1 : 2,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: variant === 'mist' ? 'rgba(52, 211, 153, 0.75)' : 'rgba(250, 204, 21, 0.78)',
            }}
          >
            Scene {chapterNumber}
          </span>

          <h2
            className="font-serif-display"
            style={{
              fontSize: 'clamp(2rem, 4.2vw, 3.1rem)',
              fontWeight: 500,
              lineHeight: 1.15,
              color: '#f3ebdd',
              letterSpacing: '-0.01em',
            }}
          >
            {heading}
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.95rem',
              color: 'rgba(243, 235, 221, 0.84)',
              fontSize: 'clamp(0.96rem, 1.3vw, 1.06rem)',
              fontWeight: 300,
              lineHeight: 1.8,
            }}
          >
            {paragraphs.map((text, idx) => (
              <p key={idx}>{text}</p>
            ))}
          </div>

          {closingLine && (
            <p
              className="font-serif-display"
              style={{
                marginTop: '0.6rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(243, 235, 221, 0.12)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.1rem, 1.8vw, 1.32rem)',
                color: '#fef08a',
                lineHeight: 1.5,
              }}
            >
              “{closingLine}”
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

