import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, ExternalLink, Loader2, MessageCircle } from 'lucide-react';
import ParticleField from './ParticleField.jsx';
import { sendApologyResponse } from '../services/whatsappService.js';

// 5 progressive size levels for the "Never 🤐" button (levels 0..4, click 5 triggers send)
const NEVER_LEVEL_STYLES = [
  {
    width: 'min(440px, 88vw)',
    minHeight: '158px',
    padding: '1.75rem 2.25rem',
    fontSize: 'clamp(1.65rem, 4.5vw, 2.35rem)',
    borderRadius: '20px',
  },
  {
    width: 'min(350px, 78vw)',
    minHeight: '118px',
    padding: '1.35rem 1.85rem',
    fontSize: 'clamp(1.35rem, 3.6vw, 1.85rem)',
    borderRadius: '18px',
  },
  {
    width: 'min(270px, 66vw)',
    minHeight: '86px',
    padding: '1rem 1.5rem',
    fontSize: 'clamp(1.12rem, 2.8vw, 1.42rem)',
    borderRadius: '16px',
  },
  {
    width: 'min(205px, 54vw)',
    minHeight: '58px',
    padding: '0.75rem 1.25rem',
    fontSize: 'clamp(0.95rem, 2.1vw, 1.12rem)',
    borderRadius: '14px',
  },
  {
    width: 'auto',
    minHeight: '42px',
    padding: '0.62rem 1.25rem',
    fontSize: '0.86rem',
    borderRadius: '999px',
  },
];

export default function FinalQuestion() {
  const shouldReduceMotion = useReducedMotion();
  const [neverClicks, setNeverClicks] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [imgError, setImgError] = useState(false);

  const idempotencyKey = useMemo(
    () => `moni-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  const submitChoice = async (action) => {
    if (isSubmitting || result) return;
    setIsSubmitting(true);
    const response = await sendApologyResponse(action, idempotencyKey);
    setResult({ ...response, action });
    setIsSubmitting(false);
  };

  const handleNeverClick = () => {
    if (isSubmitting || result) return;
    if (neverClicks < 4) {
      setNeverClicks((prev) => prev + 1);
      return;
    }
    // Click 5 triggers the WhatsApp message
    submitChoice('decline');
  };

  const currentNeverStyle = NEVER_LEVEL_STYLES[Math.min(neverClicks, 4)];

  return (
    <section
      id="final-question"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1.25rem, 5vw, 3rem)',
        background: 'linear-gradient(180deg, #16182c 0%, #10192b 45%, #1c1926 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Sunset Background Image */}
      {!imgError && (
        <img
          src="./assets/final-sunset.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={() => setImgError(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.36,
            filter: 'brightness(0.85) contrast(1.05)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Warm beige & midnight navy atmospheric wash */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 65%, rgba(243, 235, 221, 0.14) 0%, rgba(16, 25, 43, 0.72) 55%, rgba(16, 25, 43, 0.94) 100%)',
          pointerEvents: 'none',
        }}
      />

      <ParticleField
        color="rgba(250, 204, 21, 0.6)"
        secondaryColor="rgba(243, 235, 221, 0.4)"
        count={36}
      />

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 5,
          width: '100%',
          maxWidth: '760px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <span
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'rgba(250, 204, 21, 0.85)',
          }}
        >
          Final Scene
        </span>

        <h2
          className="font-serif-display"
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontWeight: 500,
            color: '#f3ebdd',
            lineHeight: 1.12,
          }}
        >
          One little question, MONI...!
        </h2>

        <p
          style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.28rem)',
            color: 'rgba(243, 235, 221, 0.9)',
            maxWidth: '34ch',
            lineHeight: 1.65,
            fontWeight: 300,
          }}
        >
          Would you like to accept my apology and can we make a few more memories?
        </p>

        {/* Interactive Choice Area */}
        {!result ? (
          <div
            style={{
              marginTop: '1.25rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.25rem',
                width: '100%',
              }}
            >
              {/* BUTTON A: Small, elegant warm gold button */}
              <motion.button
                type="button"
                disabled={isSubmitting}
                whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                onClick={() => submitChoice('accept')}
                style={{
                  minHeight: '42px',
                  padding: '0.62rem 1.25rem',
                  fontSize: '0.86rem',
                  fontWeight: 500,
                  borderRadius: '999px',
                  border: '1px solid rgba(250, 204, 21, 0.75)',
                  background: 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)',
                  color: '#120c12',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  boxShadow: '0 8px 24px rgba(250, 204, 21, 0.25)',
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                }}
              >
                Na unna manichitten 😁
              </motion.button>

              {/* BUTTON B: Starts 5x larger, shrinks across 5 levels, click 5 sends */}
              <motion.button
                type="button"
                disabled={isSubmitting}
                layout
                animate={{
                  width: currentNeverStyle.width,
                  minHeight: currentNeverStyle.minHeight,
                  padding: currentNeverStyle.padding,
                  fontSize: currentNeverStyle.fontSize,
                  borderRadius: currentNeverStyle.borderRadius,
                }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                onClick={handleNeverClick}
                style={{
                  maxWidth: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 500,
                  border: '1px solid rgba(243, 235, 221, 0.26)',
                  background: 'rgba(16, 25, 43, 0.78)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: '#f3ebdd',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  boxShadow: '0 14px 36px rgba(0, 0, 0, 0.38)',
                  lineHeight: 1.2,
                  textAlign: 'center',
                }}
              >
                Never 🤐
              </motion.button>
            </div>

            {isSubmitting && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#fef08a',
                  fontSize: '0.9rem',
                }}
              >
                <Loader2 size={16} className="animate-spin" />
                <span>Preparing your response...</span>
              </div>
            )}
          </div>
        ) : (
          /* Response Confirmation Card */
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '1rem',
              width: '100%',
              maxWidth: '500px',
              padding: '1.75rem',
              borderRadius: '16px',
              background: 'rgba(16, 25, 43, 0.86)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border:
                result.status === 'sent'
                  ? '1px solid rgba(52, 211, 153, 0.45)'
                  : '1px solid rgba(250, 204, 21, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.95rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
            }}
          >
            {result.status === 'sent' ? (
              <>
                <CheckCircle2 size={32} color="#34d399" />
                <h3
                  className="font-serif-display"
                  style={{ fontSize: '1.65rem', color: '#f3ebdd' }}
                >
                  Message Sent
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'rgba(243, 235, 221, 0.8)' }}>
                  Your response (“{result.messageText}”) was accepted by WhatsApp for
                  delivery.
                </p>
              </>
            ) : (
              <>
                <MessageCircle size={30} color="#facc15" />
                <h3
                  className="font-serif-display"
                  style={{ fontSize: '1.6rem', color: '#f3ebdd' }}
                >
                  Ready to Send on WhatsApp
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(243, 235, 221, 0.8)', lineHeight: 1.6 }}>
                  Automatic server delivery is not active right now, so no message has
                  been sent yet. Tap below to open WhatsApp with your message
                  pre-filled, then press <strong>Send</strong> in the chat.
                </p>
                <p
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.55rem 0.9rem',
                    borderRadius: '8px',
                    background: 'rgba(243, 235, 221, 0.06)',
                    color: '#fef08a',
                  }}
                >
                  “{result.messageText}”
                </p>
                <a
                  href={result.fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)',
                    color: '#120c12',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(250, 204, 21, 0.25)',
                  }}
                >
                  <span>Open WhatsApp &amp; Press Send</span>
                  <ExternalLink size={15} />
                </a>
              </>
            )}
          </motion.div>
        )}

        {/* Central Philosophy Footer */}
        <p
          className="font-serif-display"
          style={{
            marginTop: '3.5rem',
            maxWidth: '42ch',
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 1.5vw, 1.18rem)',
            color: 'rgba(243, 235, 221, 0.62)',
            lineHeight: 1.6,
          }}
        >
          “I don&apos;t want to bring back the past. I just don&apos;t want a
          misunderstanding to be the last chapter of a good story.”
        </p>
      </motion.div>
    </section>
  );
}

