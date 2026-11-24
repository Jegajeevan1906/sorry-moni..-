import { motion, useReducedMotion } from 'framer-motion';

export default function ApologySection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="apology"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(4.5rem, 9vw, 8rem) clamp(1.25rem, 5vw, 3rem)',
        background: 'linear-gradient(180deg, #141220 0%, #181326 55%, #10192b 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Soft golden ambient aura */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 'min(640px, 95vw)',
          height: 'min(640px, 95vw)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(250, 204, 21, 0.08) 0%, transparent 68%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          marginBottom: '2.5rem',
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: '0.72rem',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'rgba(250, 204, 21, 0.78)',
            marginBottom: '0.75rem',
          }}
        >
          Scene 05 · The Apology
        </span>
        <h2
          className="font-serif-display"
          style={{
            fontSize: 'clamp(2rem, 4.2vw, 3.1rem)',
            fontWeight: 500,
            color: '#f3ebdd',
            lineHeight: 1.15,
          }}
        >
          A few words I should have said earlier.
        </h2>
      </motion.div>

      {/* Vintage Paper Letter Card */}
      <motion.article
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '720px',
          padding: 'clamp(2rem, 5vw, 3.75rem)',
          borderRadius: '10px',
          background: 'linear-gradient(165deg, #f7f1e5 0%, #efe4d0 100%)',
          color: '#1f191a',
          boxShadow:
            '0 30px 70px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(250, 204, 21, 0.22)',
        }}
      >
        {/* Subtle top decorative hairline */}
        <div
          aria-hidden="true"
          style={{
            width: '48px',
            height: '2px',
            background: 'rgba(127, 29, 29, 0.35)',
            marginBottom: '1.75rem',
          }}
        />

        <p
          className="font-handwritten"
          style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.2rem)',
            color: '#181326',
            marginBottom: '1.25rem',
            lineHeight: 1.2,
          }}
        >
          Monika,
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.05rem',
            fontSize: 'clamp(0.98rem, 1.35vw, 1.08rem)',
            lineHeight: 1.85,
            color: '#2a2224',
            fontWeight: 400,
          }}
        >
          <p>I am genuinely sorry.</p>
          <p>
            I am sorry for blocking you without trying to understand things properly.
          </p>
          <p>
            I am sorry for making assumptions and allowing my ego to decide what I
            should have communicated.
          </p>
          <p>
            I don&apos;t know what you went through during that time, and I won&apos;t
            pretend that I know.
          </p>
          <p>I also understand that things might not feel the same anymore.</p>
          <p>
            I&apos;m not expecting you to forget everything or suddenly become the
            person you were back then.
          </p>
          <p>
            I just wanted you to know that I never considered those memories
            meaningless.
          </p>
          <p>And if my actions ever made you feel otherwise, I am sorry.</p>
          <p
            className="font-serif-display"
            style={{
              marginTop: '0.65rem',
              fontSize: 'clamp(1.2rem, 2vw, 1.45rem)',
              fontWeight: 600,
              fontStyle: 'italic',
              color: '#10192b',
              lineHeight: 1.45,
            }}
          >
            You deserved a conversation, not a disappearance.
          </p>
        </div>
      </motion.article>
    </section>
  );
}

