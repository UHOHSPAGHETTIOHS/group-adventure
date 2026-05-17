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
        timer = setTimeout(() => setStepIndex(i => i + 1), 4000); // longer for bigger text
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
      {/* CSS Basement */}
      <div className="absolute inset-0 bg-gray-800" />
      <div className="absolute left-1/2 top-3/4 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-gray-700 rounded-full opacity-50" />

      {/* Table – much wider and taller */}
      <div className="absolute left-[10%] right-[10%] top-[30%] h-20 bg-amber-900 border-2 border-amber-700 rounded-lg shadow-lg" />
      <div className="absolute left-[12%] top-[calc(30%+80px)] w-6 h-28 bg-amber-900" />
      <div className="absolute right-[12%] top-[calc(30%+80px)] w-6 h-28 bg-amber-900" />

      {/* Couch */}
      <div className="absolute left-4 top-[55%] w-40 h-20 bg-gray-600 rounded-lg border border-gray-500" />

      {/* TV stand and TV – MUCH larger */}
      <div className="absolute right-4 top-[50%] w-32 h-12 bg-gray-700 rounded" />
      <div
        className={`absolute right-6 top-[32%] w-48 h-32 bg-black border-4 border-gray-500 rounded flex items-center justify-center text-center font-heading ${
          tvText ? 'bg-red-900 animate-pulse' : ''
        }`}
      >
        {tvText ? (
          <span className="text-red-300 text-base md:text-lg leading-tight px-2">{tvText}</span>
        ) : (
          <span className="text-gray-500 text-lg">OFF</span>
        )}
      </div>

      {/* Board game pieces – bigger */}
      <div className="absolute left-[25%] top-[33%] w-6 h-6 bg-red-500 rounded-full" />
      <div className="absolute left-[40%] top-[35%] w-6 h-6 bg-blue-500 rounded-full" />
      <div className="absolute left-[55%] top-[34%] w-6 h-6 bg-green-500 rounded-full" />

      {/* Avatars – much bigger */}
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
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-gray-400 shadow-md"
            />
            <p className="text-sm md:text-base text-gray-200 font-heading text-center mt-1">
              {name}
            </p>
          </div>
        );
      })}

      {/* Speech Bubble – much larger */}
      {dialogue && (
        <div
          className="absolute z-20 bg-black border-2 border-blood-600 text-gray-100 p-4 rounded-lg text-base md:text-xl font-body max-w-md shadow-2xl"
          style={{
            left: `${positions[dialogue.speaker].x + 5}%`,
            top: `${positions[dialogue.speaker].y - 15}%`,
          }}
        >
          <p className="font-heading text-blood-400 text-lg md:text-2xl mb-2">
            {dialogue.speaker}
          </p>
          <p>{dialogue.text}</p>
        </div>
      )}
    </div>
  );
}