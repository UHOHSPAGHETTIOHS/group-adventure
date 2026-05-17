'use client';

import { useEffect, useState, useRef } from 'react';
import { AnimatedScene } from '@/lib/scenes';

function avatarUrl(name: string): string {
  return `/avatars/${name}.jpg`;
}

interface StageProps {
  scene: AnimatedScene;
  onComplete?: () => void;
  overlay?: string;
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
      {/* Floor */}
      <div className="absolute inset-0 bg-gray-800" />

      {/* ---------- CENTRE TABLE (wide, squarish) ---------- */}
      <div className="absolute left-[5%] right-[5%] top-[35%] h-20 bg-amber-800 border-2 border-amber-600 rounded-lg shadow-xl" />

      {/* Board game pieces on table */}
      <div className="absolute left-[28%] top-[41%] w-8 h-8 bg-red-500 rounded-full" />
      <div className="absolute left-[45%] top-[43%] w-8 h-8 bg-blue-500 rounded-full" />
      <div className="absolute left-[62%] top-[40%] w-8 h-8 bg-green-500 rounded-full" />

      {/* ---------- COUCHES ---------- */}
      {/* Bottom‑left couch (wider, squatter) */}
      <div className="absolute left-[5%] bottom-[8%] w-[40%] h-16 bg-gray-600 rounded-lg border border-gray-500">
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gray-700 rounded-r" />
        <div className="absolute left-[10%] top-[15%] w-[22%] h-[70%] bg-gray-500 rounded" />
        <div className="absolute left-[35%] top-[15%] w-[22%] h-[70%] bg-gray-500 rounded" />
        <div className="absolute left-[60%] top-[15%] w-[22%] h-[70%] bg-gray-500 rounded" />
      </div>

      {/* Bottom‑centre couch (same size) */}
      <div className="absolute left-[50%] bottom-[8%] w-[40%] h-16 bg-gray-600 rounded-lg border border-gray-500">
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gray-700 rounded-r" />
        <div className="absolute left-[10%] top-[15%] w-[22%] h-[70%] bg-gray-500 rounded" />
        <div className="absolute left-[35%] top-[15%] w-[22%] h-[70%] bg-gray-500 rounded" />
        <div className="absolute left-[60%] top-[15%] w-[22%] h-[70%] bg-gray-500 rounded" />
      </div>

      {/* ---------- TV (bottom‑right, bigger) ---------- */}
      <div className="absolute right-[5%] bottom-[8%] w-64 h-40 bg-gray-700 rounded border-2 border-gray-500 flex items-center justify-center">
        <div
          className={`w-[92%] h-[82%] bg-black rounded flex items-center justify-center text-center font-heading overflow-hidden ${
            tvText ? 'bg-red-900 animate-pulse' : ''
          }`}
        >
          {tvText ? (
            <span className="text-red-300 text-sm md:text-base leading-tight px-1">{tvText}</span>
          ) : (
            <span className="text-gray-500 text-xl">OFF</span>
          )}
        </div>
      </div>
      {/* TV antenna */}
      <div className="absolute right-[8%] bottom-[32%] w-1 h-10 bg-gray-500 transform rotate-12 origin-bottom" />

      {/* ---------- AVATARS (larger) ---------- */}
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
                ? 'shake-exaggerated 0.3s infinite'
                : isTwitching
                ? 'twitch-exaggerated 0.4s infinite'
                : 'none',
            }}
          >
            <img
              src={avatarUrl(name)}
              alt={name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-gray-400 shadow-md"
            />
            <p className="text-xs md:text-sm text-gray-200 font-heading text-center mt-1">
              {name}
            </p>
          </div>
        );
      })}

      {/* ---------- SPEECH BUBBLE (extra large) ---------- */}
      {dialogue && (
        <div
          className="absolute z-20 bg-black border-2 border-blood-600 text-gray-100 p-5 rounded-xl text-xl md:text-2xl font-body max-w-lg shadow-2xl"
          style={{
            left: `${positions[dialogue.speaker].x + 5}%`,
            top: `${positions[dialogue.speaker].y - 14}%`,
          }}
        >
          <p className="font-heading text-blood-400 text-2xl md:text-3xl mb-3">
            {dialogue.speaker}
          </p>
          <p>{dialogue.text}</p>
        </div>
      )}

      {/* ---------- VOTING OVERLAY ---------- */}
      {overlay && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-blood-900/90 text-white font-heading text-3xl md:text-5xl px-10 py-4 rounded-lg border border-blood-600 animate-pulse z-30">
          {overlay}
        </div>
      )}
    </div>
  );
}