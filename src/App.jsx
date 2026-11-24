import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IntroAnimation from './components/IntroAnimation.jsx';
import StorySection from './components/StorySection.jsx';
import MemorySection from './components/MemorySection.jsx';
import ApologySection from './components/ApologySection.jsx';
import AdventureSection from './components/AdventureSection.jsx';
import FinalQuestion from './components/FinalQuestion.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import SceneProgress from './components/SceneProgress.jsx';
import ParticleField from './components/ParticleField.jsx';

function SceneDivider() {
  return (
    <div className="scene-divider" aria-hidden="true">
      <span className="scene-divider-dot" />
    </div>
  );
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#10192b' }}>
      {/* Subtle 35mm film grain overlay */}
      <div className="film-grain" aria-hidden="true" />

      <AudioPlayer />

      <AnimatePresence mode="wait">
        {!introDone && (
          <IntroAnimation key="intro" onComplete={() => setIntroDone(true)} />
        )}
      </AnimatePresence>

      {/* Main Story Experience */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0.15 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{ position: 'relative' }}
      >
        {introDone && <SceneProgress />}

        {/* Ambient floating particles across the narrative */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <ParticleField count={20} />
        </div>

        {/* SECTION 01: THE BEGINNING */}
        <StorySection
          id="beginning"
          chapterNumber="01"
          label="The Beginning"
          heading="Hey, MONI...!"
          imageSrc="./assets/september-canteen.jpg"
          imageAlt="Nostalgic college canteen in warm September afternoon sunlight"
          variant="editorial"
          paragraphs={[
            'Some stories begin with a plan.',
            'Ours began with an ordinary day, somewhere in September, at an unexpected place.',
            "I didn't know that a random conversation over lunch would eventually become a collection of memories worth keeping.",
            "Funny how life works, isn't it?",
            'Some people arrive without an announcement, yet leave behind stories that stay.',
          ]}
          closingLine="Some of the best stories begin when nobody is expecting them."
        />

        <SceneDivider />

        {/* SECTION 02: THE MEMORIES */}
        <MemorySection />

        <SceneDivider />

        {/* SECTION 03: THE DISTANCE */}
        <StorySection
          id="distance"
          chapterNumber="03"
          label="The Distance"
          heading="And then, somewhere, things changed."
          imageSrc="./assets/distance-platform.jpg"
          imageAlt="Lonely railway platform in dark blue evening mist and rain"
          variant="mist"
          reverse
          paragraphs={[
            "I thought I wasn't getting the same response anymore.",
            'I got upset. I made assumptions. And instead of asking what was happening, I chose to walk away.',
            'I blocked you.',
            'The irony?',
            'For quite some time, I believed you had blocked me.',
            'I carried that misunderstanding without even realizing that I was the one who had created the distance.',
            'Perhaps ego is strange.',
            "It makes us wait for someone to return, even when we're the ones who closed the door.",
          ]}
          closingLine="I am sorry for letting a misunderstanding speak louder than our friendship."
        />

        <SceneDivider />

        {/* SECTION 04: THE THINGS I KEPT */}
        <StorySection
          id="kept"
          chapterNumber="04"
          label="The Things I Kept"
          heading="Not everything disappeared."
          imageSrc="./assets/memory-book.jpg"
          imageAlt="Vintage book with a folded blank paper note in warm window light"
          variant="keepsake"
          paragraphs={[
            'That little piece of paper tucked away with it.',
            "I don't know why certain ordinary things become so difficult to throw away.",
            'Maybe because they carry a little piece of a particular time.',
            'I kept them.',
            'Not because I was waiting for a perfect moment, but because some memories deserve a little space on their own.',
            'Time moves forward. Some little things simply stay.',
          ]}
        />

        <SceneDivider />

        {/* SECTION 05: THE APOLOGY */}
        <ApologySection />

        <SceneDivider />

        {/* SECTION 06: THE ADVENTURE */}
        <AdventureSection />

        <SceneDivider />

        {/* FINAL SCENE: INTERACTIVE APOLOGY */}
        <FinalQuestion />
      </motion.main>
    </div>
  );
}

