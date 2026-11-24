import { useEffect, useState } from 'react';

const SCENES = [
  { id: 'beginning', label: '01 · Beginning' },
  { id: 'memories', label: '02 · Memories' },
  { id: 'distance', label: '03 · Distance' },
  { id: 'kept', label: '04 · Kept' },
  { id: 'apology', label: '05 · Apology' },
  { id: 'adventure', label: '06 · Adventure' },
  { id: 'final-question', label: '07 · Question' },
];

export default function SceneProgress() {
  const [activeId, setActiveId] = useState('beginning');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { threshold: 0.35 }
    );

    SCENES.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Story chapters"
      style={{
        position: 'fixed',
        top: '1.15rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 55,
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.38rem 0.85rem',
        borderRadius: '999px',
        background: 'rgba(16, 25, 43, 0.68)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(243, 235, 221, 0.12)',
        maxWidth: '92vw',
        overflowX: 'auto',
      }}
    >
      {SCENES.map((scene) => {
        const isActive = activeId === scene.id;
        return (
          <a
            key={scene.id}
            href={`#${scene.id}`}
            title={scene.label}
            aria-label={scene.label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem 0.45rem',
              borderRadius: '999px',
              textDecoration: 'none',
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              color: isActive ? '#fef08a' : 'rgba(243, 235, 221, 0.48)',
              background: isActive ? 'rgba(250, 204, 21, 0.12)' : 'transparent',
              transition: 'all 0.25s ease',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: isActive ? '#facc15' : 'rgba(243, 235, 221, 0.3)',
              }}
            />
            <span style={{ display: isActive ? 'inline' : 'none' }}>{scene.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

