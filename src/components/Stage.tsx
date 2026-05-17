'use client';

import { useEffect, useState, useRef } from 'react';
import { AnimatedScene } from '@/lib/scenes';

function avatarUrl(name: string): string {
  return `/avatars/${name}.jpg`;
}

interface StageProps {
  scene: AnimatedScene;
  onComplete?: () => void;
}

export default function Stage({ scene, onComplete }: StageProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [dialogue, setDialogue] = useState<{ speaker: string; text: string } | null>(null);
  const [tvText, setTvText] = useState<string | null>(null);
  const [shaking, setShaking] = useState<string | null>(null);
  const [twitching, setTwitching] = useState<string | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete; // always keep the latest callback

  const sequence = scene.sequence;
  const positions = scene.positions;
  const names = Object.keys(positions);

  useEffect(() => {
    if (stepIndex >= sequence.length) {
      // Sequence finished
      onCompleteRef.current?.();
      return;
    }

    const step = sequence[stepIndex];

    // Reset all visual states
    setDialogue(null);
    setTvText(null);
    setShaking(null);
    setTwitching(null);

    let timer: NodeJS.Timeout;

    switch (step.type) {
      case 'dialogue':
        setDialogue({ speaker: step.speaker, text: step.text });
        timer = setTimeout(() => setStepIndex(i => i + 1), 3000);
        break;

      case 'tv_alert':
        setTvText(step.text);
        timer = setTimeout(() => setStepIndex(i => i + 1), 3000);
        break;

      case 'action':
        if (step.effect === 'shake') setShaking(step.target);
        else if (step.effect === 'twitch') setTwitching(step.target);
        timer = setTimeout(() => {
          setShaking(null);
          setTwitching(null);
          setStepIndex(i => i + 1);
        }, 1500);
        break;

      case 'pause':
        timer = setTimeout(() => setStepIndex(i => i + 1), step.duration);
        break;

      default:
        timer = setTimeout(() => setStepIndex(i => i + 1), 100);
    }

    return () => clearTimeout(timer);
    // onComplete is intentionally NOT in the dependency array – we use the ref instead
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, sequence]);

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 border-4 border-blood-800 overflow-hidden shadow-[0_0_30px_rgba(139,0,0,0.5)]">
      {/* CSS Basement */}
      {/* Floor */}
      <div className="absolute inset-0 bg-gray-800" />
      {/* Rug */}
      <div className="absolute left-1/2 top-3/4 -translate-x-1/2 -translate-y-1/2 w-3/4 h-20 bg-gray-700 rounded-full opacity-50" />

      {/* Table */}
      <div className="absolute left-1/4 right-1/4 top-[35%] h-16 bg-amber-900 border-2 border-amber-700 rounded-lg shadow-lg" />
      <div className="absolute left-[28%] top-[calc(35%+64px)] w-4 h-20 bg-amber-900" />
      <div className="absolute right-[28%] top-[calc(35%+64px)] w-4 h-20 bg-amber-900" />

      {/* Couch */}
      <div className="absolute left-2 top-[60%] w-32 h-16 bg-gray-600 rounded-lg border border-gray-500" />

      {/* TV */}
      <div className="absolute right-2 top-[55%] w-20 h-10 bg-gray-700 rounded" />
      <div
        className={`absolute right-4 top-[35%] w-16 h-12 bg-black border-2 border-gray-600 rounded flex items-center justify-center text-center text-xs font-heading ${
          tvText ? 'bg-red-900 animate-pulse' : ''
        }`}
      >
        {tvText ? (
          <span className="text-red-300 text-[8px] leading-tight">{tvText}</span>
        ) : (
          <span className="text-gray-500">OFF</span>
        )}
      </div>

      {/* Board game pieces */}
      <div className="absolute left-[30%] top-[37%] w-4 h-4 bg-red-500 rounded-full" />
      <div className="absolute left-[45%] top-[39%] w-4 h-4 bg-blue-500 rounded-full" />

      {/* Avatars */}
      {names.map(name => {
        const pos = positions[name];
        const isShaking = shaking === name;
        const isTwitching = twitching === name;

        return (
          <div
            key={name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              animation: isShaking
                ? 'shake 0.3s infinite'
                : isTwitching
                ? 'twitch 0.5s infinite'
                : 'none',
            }}
          >
            <img
              src={avatarUrl(name)}
              alt={name}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-400 shadow-md"
            />
            <p className="text-[10px] md:text-xs text-gray-200 font-heading text-center mt-1">
              {name}
            </p>
          </div>
        );
      })}

      {/* Speech Bubble */}
      {dialogue && (
        <div
          className="absolute z-20 bg-black border border-blood-600 text-gray-100 p-2 md:p-3 rounded-md text-xs md:text-sm font-body max-w-[200px] md:max-w-xs shadow-lg"
          style={{
            left: `${positions[dialogue.speaker].x + 5}%`,
            top: `${positions[dialogue.speaker].y - 12}%`,
          }}
        >
          <p className="font-heading text-blood-400 text-[10px] md:text-xs mb-1">
            {dialogue.speaker}
          </p>
          <p>{dialogue.text}</p>
        </div>
      )}
    </div>
  );
}