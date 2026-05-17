'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
  // ---- Mutable positions so avatars can move during the scene ----
  const [currentPositions, setCurrentPositions] = useState<Record<string, { x: number; y: number }>>(scene.positions);

  const [stepIndex, setStepIndex] = useState(0);
  const [dialogue, setDialogue] = useState<{ speaker: string; text: string } | null>(null);
  const [displayedText, setDisplayedText] = useState('');
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
  const soundEffectRef = useRef<HTMLAudioElement | null>(null);

  // Typewriter
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sequence = scene.sequence;

  // Reset positions when the scene changes
  useEffect(() => {
    setCurrentPositions(scene.positions);
  }, [scene]);

  // Preload audio
  useEffect(() => {
    const talk = new Audio('/sounds/talk.mp3'); talk.volume = 0.4; talkAudioRef.current = talk;
    const stat = new Audio('/sounds/static.mp3'); stat.volume = 0.5; staticAudioRef.current = stat;
    const tvTalk = new Audio('/sounds/tvtalk.mp3'); tvTalk.volume = 0.7; tvTalkAudioRef.current = tvTalk;
    soundEffectRef.current = new Audio();
    return () => {
      stopAllAudio();
      clearTyping();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const stopAllAudio = () => {
    [talkAudioRef, staticAudioRef, tvTalkAudioRef, soundEffectRef].forEach(ref => {
      if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; }
    });
  };

  const clearTyping = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };

  const startTyping = useCallback((fullText: string) => {
    clearTyping();
    setDisplayedText('');
    typingIndexRef.current = 0;
    typingIntervalRef.current = setInterval(() => {
      typingIndexRef.current++;
      setDisplayedText(fullText.substring(0, typingIndexRef.current));
      if (typingIndexRef.current >= fullText.length) {
        clearTyping();
      }
    }, 30);
  }, []);

  const goToNextStep = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStepIndex(i => i + 1);
  }, []);

  useEffect(() => {
    if (stepIndex >= sequence.length) {
      stopAllAudio();
      clearTyping();
      onCompleteRef.current?.();
      return;
    }

    const step = sequence[stepIndex];
    console.log(`🎬 Step ${stepIndex}:`, step.type, 'speaker' in step ? step.speaker : '');

    // Reset visuals
    setDialogue(null);
    setDisplayedText('');
    setTvText(null);
    setTvStatic(false);
    setShaking(null);
    setTwitching(null);
    clearTyping();
    stopAllAudio();

    if (timerRef.current) clearTimeout(timerRef.current);

    switch (step.type) {
      case 'dialogue': {
        const fullText = step.text;
        setDialogue({ speaker: step.speaker, text: fullText });
        talkAudioRef.current?.play().catch(() => {});
        startTyping(fullText);
        const typingDuration = fullText.length * 30;
        const stopAudioTimer = setTimeout(stopAllAudio, typingDuration);
        timerRef.current = setTimeout(() => {
          clearTimeout(stopAudioTimer);
          stopAllAudio();
          clearTyping();
          goToNextStep();
        }, typingDuration + 3000);   // ← 3‑second pause after typing finishes
        break;
      }

      case 'tv_alert': {
        setTvStatic(true);
        staticAudioRef.current?.play().catch(() => {});
        const staticTimer = setTimeout(() => {
          setTvStatic(false);
          setTvText(step.text);
          stopAllAudio();
          tvTalkAudioRef.current?.play().catch(() => {});
          timerRef.current = setTimeout(() => {
            stopAllAudio();
            goToNextStep();
          }, 4000);
        }, 600);
        timerRef.current = staticTimer;
        break;
      }

      case 'action': {
        if (step.effect === 'shake') setShaking(step.target);
        else if (step.effect === 'twitch') setTwitching(step.target);
        timerRef.current = setTimeout(() => {
          setShaking(null);
          setTwitching(null);
          goToNextStep();
        }, 1500);
        break;
      }

      case 'move_avatar': {
        setCurrentPositions(prev => ({
          ...prev,
          [step.target]: { x: step.x, y: step.y },
        }));
        // Wait for CSS transition (300ms) + a small buffer
        timerRef.current = setTimeout(goToNextStep, 600);
        break;
      }

      case 'pause': {
        timerRef.current = setTimeout(goToNextStep, step.duration);
        break;
      }

      case 'sound': {
        if (soundEffectRef.current) {
          soundEffectRef.current.src = `/sounds/${step.file}`;
          soundEffectRef.current.play().catch(() => {});
        }
        timerRef.current = setTimeout(goToNextStep, 1500);
        break;
      }

      case 'remove_avatar': {
        // For now we just skip – you can implement hiding later
        goToNextStep();
        break;
      }

      default:
        goToNextStep();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTyping();
      stopAllAudio();
    };
  }, [stepIndex, sequence, goToNextStep, startTyping]);

  // Bubble positioning uses the current (possibly moved) positions
  const getBubblePosition = (speaker: string) => {
    const pos = currentPositions[speaker] || { x: 50, y: 50 };
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

      {/* ---------- AVATARS (using currentPositions) ---------- */}
      {Object.keys(currentPositions).map(name => {
        const pos = currentPositions[name];
        if (!pos) return null;
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
            <p className="text-sm md:text-base text-gray-200 font-heading text-center mt-1">{name}</p>
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
          <p className="font-heading text-blood-400 text-3xl md:text-4xl mb-4">{dialogue.speaker}</p>
          <p>{displayedText}</p>
          {typingIntervalRef.current && (
            <span className="animate-pulse text-blood-400">|</span>
          )}
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