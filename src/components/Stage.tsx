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
  const [tvStatic, setTvStatic] = useState(false);
  const [shaking, setShaking] = useState<string | null>(null);
  const [twitching, setTwitching] = useState<string | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Audio refs
  const talkAudioRef = useRef<HTMLAudioElement | null>(null);
  const staticAudioRef = useRef<HTMLAudioElement | null>(null);
  const tvTalkAudioRef = useRef<HTMLAudioElement | null>(null);

  const sequence = scene.sequence;
  const positions = scene.positions;
  const names = Object.keys(positions);

  // Preload audio
  useEffect(() => {
    const talk = new Audio('/sounds/talk.mp3');
    talk.volume = 0.4;
    talkAudioRef.current = talk;

    const stat = new Audio('/sounds/static.mp3');
    stat.volume = 0.5;
    staticAudioRef.current = stat;

    const tvTalk = new Audio('/sounds/tvtalk.mp3');
    tvTalk.volume = 0.7;
    tvTalkAudioRef.current = tvTalk;

    return () => {
      // Cleanup on unmount
      stopAllAudio();
    };
  }, []);

  // Stop all audio instantly
  const stopAllAudio = () => {
    [talkAudioRef, staticAudioRef, tvTalkAudioRef].forEach(ref => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
  };

  const playTalk = () => {
    stopAllAudio(); // stop any previous sound
    if (talkAudioRef.current) {
      talkAudioRef.current.currentTime = 0;
      talkAudioRef.current.play().catch(() => {});
    }
  };

  const playStatic = () => {
    stopAllAudio();
    if (staticAudioRef.current) {
      staticAudioRef.current.currentTime = 0;
      staticAudioRef.current.play().catch(() => {});
    }
  };

  const playTVTalk = () => {
    stopAllAudio();
    if (tvTalkAudioRef.current) {
      tvTalkAudioRef.current.currentTime = 0;
      tvTalkAudioRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    if (stepIndex >= sequence.length) {
      stopAllAudio(); // cut all sound when sequence ends
      onCompleteRef.current?.();
      return;
    }

    const step = sequence[stepIndex];
    // Reset visuals
    setDialogue(null);
    setTvText(null);
    setTvStatic(false);
    setShaking(null);
    setTwitching(null);

    let timer: NodeJS.Timeout;

    switch (step.type) {
      case 'dialogue':
        setDialogue({ speaker: step.speaker, text: step.text });
        playTalk();
        timer = setTimeout(() => {
          stopAllAudio(); // cut the talk sound when dialogue ends
          setStepIndex(i => i + 1);
        }, 4000);
        break;

      case 'tv_alert':
        // Phase 1: static
        setTvStatic(true);
        playStatic();
        timer = setTimeout(() => {
          setTvStatic(false);
          setTvText(step.text);
          stopAllAudio(); // stop static before playing tv talk
          playTVTalk();
          const alertTimer = setTimeout(() => {
            stopAllAudio(); // stop tv talk when alert finishes
            setStepIndex(i => i + 1);
          }, 4000);
          return () => clearTimeout(alertTimer);
        }, 600);
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

    return () => {
      clearTimeout(timer);
      // Note: we don't stop audio here because the new step will handle it.
      // However, if the component unmounts, the cleanup above will stop everything.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, sequence]);

  // Smart bubble positioning
  const getBubblePosition = (speaker: string) => {
    const pos = positions[speaker];
    let left = pos.x + 5;
    let top = pos.y - 15;

    if (left > 85) left = pos.x - 30;
    left = Math.max(5, Math.min(left, 85));

    if (top < 5) top = pos.y + 5;
    top = Math.max(5, Math.min(top, 80));

    return { left, top };
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 border-4 border-blood-800 overflow-hidden shadow-[0_0_30px_rgba(139,0,0,0.5)]">
      {/* Floor */}
      <div className="absolute inset-0 bg-gray-800" />

      {/* ---------- CENTRE TABLE ---------- */}
      <div className="absolute left-[8%] right-[8%] top-[38%] h-16 bg-amber-800 border-2 border-amber-600 rounded-lg shadow-xl" />
      <div className="absolute left-[28%] top-[44%] w-8 h-8 bg-red-500 rounded-full" />
      <div className="absolute left-[45%] top-[46%] w-8 h-8 bg-blue-500 rounded-full" />
      <div className="absolute left-[62%] top-[43%] w-8 h-8 bg-green-500 rounded-full" />

      {/* ---------- COUCH ---------- */}
      <div className="absolute right-[22%] bottom-[4%] w-[25%] h-14 bg-gray-600 rounded-lg border border-gray-500">
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gray-700 rounded-r" />
        <div className="absolute left-[10%] top-[12%] w-[25%] h-[75%] bg-gray-500 rounded" />
        <div className="absolute left-[40%] top-[12%] w-[25%] h-[75%] bg-gray-500 rounded" />
        <div className="absolute left-[70%] top-[12%] w-[25%] h-[75%] bg-gray-500 rounded" />
      </div>

      {/* ---------- TV ---------- */}
      <div className="absolute left-[3%] bottom-[6%] w-72 h-44 bg-gray-700 rounded border-2 border-gray-500 flex items-center justify-center">
        <div
          className={`w-[92%] h-[82%] bg-black rounded flex items-center justify-center text-center font-heading overflow-hidden ${
            tvStatic ? 'bg-gray-500 animate-pulse' : tvText ? 'bg-red-900' : ''
          }`}
        >
          {tvStatic ? (
            <span className="text-gray-300 text-lg md:text-xl animate-ping">⚡ STATIC ⚡</span>
          ) : tvText ? (
            <span className="text-red-300 text-sm md:text-lg leading-tight px-1">{tvText}</span>
          ) : (
            <span className="text-gray-500 text-2xl">OFF</span>
          )}
        </div>
      </div>
      <div className="absolute left-[5%] bottom-[30%] w-1 h-12 bg-gray-500 transform -rotate-12 origin-bottom" />

      {/* ---------- AVATARS ---------- */}
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
              className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover border-2 border-gray-400 shadow-md"
            />
            <p className="text-sm md:text-base text-gray-200 font-heading text-center mt-1">
              {name}
            </p>
          </div>
        );
      })}

      {/* ---------- SPEECH BUBBLE ---------- */}
      {dialogue && (
        <div
          className="absolute z-20 bg-black border-2 border-blood-600 text-gray-100 p-6 rounded-xl text-2xl md:text-3xl font-body max-w-2xl shadow-2xl"
          style={{
            left: `${getBubblePosition(dialogue.speaker).left}%`,
            top: `${getBubblePosition(dialogue.speaker).top}%`,
          }}
        >
          <p className="font-heading text-blood-400 text-3xl md:text-4xl mb-4">
            {dialogue.speaker}
          </p>
          <p>{dialogue.text}</p>
        </div>
      )}

      {/* ---------- VOTING OVERLAY ---------- */}
      {overlay && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-blood-900/90 text-white font-heading text-4xl md:text-6xl px-12 py-5 rounded-lg border border-blood-600 animate-pulse z-30">
          {overlay}
        </div>
      )}
    </div>
  );
}