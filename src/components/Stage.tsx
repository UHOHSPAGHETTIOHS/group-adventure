'use client';

import { useEffect, useState, useRef } from 'react';
import { AnimatedScene } from '@/lib/scenes';

function avatarUrl(name: string): string {
  return `/avatars/${name}.jpg`;
}

interface StageProps {
  scene: AnimatedScene;
  onComplete?: () => void;
  overlay?: string; // optional text overlay (e.g., "VOTING IN PROGRESS")
}

export default function Stage({ scene, onComplete, overlay }: StageProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [dialogue, setDialogue] = useState<{ speaker: string; text: string } | null>(null);
  const [tvText, setTvText] = useState<string | null>(null);
  const [shaking, setShaking] = useState<string | null>(null);
  const [twitching, setTwitching] = useState<string | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const sequence = scene.sequence;
  const positions = scene.positions;
  const names = Object.keys(positions);

  useEffect(() => {
    if (stepIndex >= sequence.length) {
      onCompleteRef.current?.();
      return;
    }

    const step = sequence[stepIndex];
    setDialogue(null);
    setTvText(null);
    setShaking(null);
    setTwitching(null);

    let timer: NodeJS.Timeout;

    switch (step.type) {
      case 'dialogue':
        setDialogue({ speaker: step.speaker, text: step.text });
        timer = setTimeout(() => setStepIndex(i => i + 1), 4000);
        break;

      case 'tv_alert':
        setTvText(step.text);
        timer = setTimeout(() => setStepIndex(i => i + 1), 4000);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, sequence]);

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 border-4 border-blood-800 overflow-hidden shadow-[0_0_30px_rgba(139,0,0,0.5)]">
      {/* ----- TOP-DOWN BASEMENT ----- */}
      {/* Floor */}
      <div className="absolute inset-0 bg-gray-800" />

      {/* Big wooden table (top center) */}
      <div className="absolute left-[15%] right-[15%] top-[10%] h-32 bg-amber-800 border-2 border-amber-600 rounded-lg shadow-xl" />

      {/* Board game pieces on table */}
      <div className="absolute left-[30%] top-[18%] w-5 h-5 bg-red-500 rounded-full" />
      <div className="absolute left-[45%] top-[20%] w-5 h-5 bg-blue-500 rounded-full" />
      <div className="absolute left-[60%] top-[17%] w-5 h-5 bg-green-500 rounded-full" />

      {/* Couch (bottom center) */}
      <div className="absolute left-[30%] right-[30%] bottom-[10%] h-16 bg-gray-600 rounded-lg border border-gray-500" />
      {/* Couch cushions */}
      <div className="absolute left-[33%] bottom-[12%] w-[12%] h-10 bg-gray-500 rounded" />
      <div className="absolute left-[47%] bottom-[12%] w-[12%] h-10 bg-gray-500 rounded" />
      <div className="absolute left-[61%] bottom-[12%] w-[12%] h-10 bg-gray-500 rounded" />

      {/* TV (bottom left) */}
      <div className="absolute left-[5%] bottom-[15%] w-32 h-24 bg-gray-700 rounded border-2 border-gray-500 flex items-center justify-center">
        <div
          className={`w-[90%] h-[80%] bg-black rounded flex items-center justify-center text-center font-heading ${
            tvText ? 'bg-red-900 animate-pulse' : ''
          }`}
        >
          {tvText ? (
            <span className="text-red-300 text-sm md:text-base leading-tight px-1">{tvText}</span>
          ) : (
            <span className="text-gray-500 text-lg">OFF</span>
          )}
        </div>
      </div>
      {/* TV antenna */}
      <div className="absolute left-[6%] bottom-[38%] w-1 h-8 bg-gray-500 transform -rotate-12 origin-bottom" />

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
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gray-400 shadow-md"
            />
            <p className="text-xs md:text-sm text-gray-200 font-heading text-center mt-1">{name}</p>
          </div>
        );
      })}

      {/* Speech Bubble */}
      {dialogue && (
        <div
          className="absolute z-20 bg-black border-2 border-blood-600 text-gray-100 p-4 rounded-lg text-base md:text-xl font-body max-w-md shadow-2xl"
          style={{
            left: `${positions[dialogue.speaker].x + 5}%`,
            top: `${positions[dialogue.speaker].y - 15}%`,
          }}
        >
          <p className="font-heading text-blood-400 text-lg md:text-2xl mb-2">{dialogue.speaker}</p>
          <p>{dialogue.text}</p>
        </div>
      )}

      {/* Overlay text (e.g., voting status) */}
      {overlay && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blood-900/90 text-white font-heading text-xl md:text-3xl px-6 py-3 rounded-lg border border-blood-600 animate-pulse">
          {overlay}
        </div>
      )}
    </div>
  );
}