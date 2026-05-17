'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GameData } from '@/lib/types';
import { act1Scenes, basementIntro } from '@/lib/scenes';
import Stage from '@/components/Stage';

export default function HostPage() {
  const params = useParams();
  const room = params.room as string;
  const router = useRouter();
  const [hostId, setHostId] = useState<string | null>(null);
  const [game, setGame] = useState<GameData | null>(null);
  const [error, setError] = useState('');
  const [stageFinished, setStageFinished] = useState(false);
  const [votingOverlay, setVotingOverlay] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('hostId');
    if (stored) setHostId(stored);
    else router.push('/');
  }, [router]);

  const fetchGame = useCallback(async () => {
    if (!room) return;
    const res = await fetch(`/api/game-state?room=${room}`);
    const data = await res.json();
    if (data.error) setError(data.error);
    else setGame(data);
  }, [room]);

  useEffect(() => {
    fetchGame();
    const interval = setInterval(fetchGame, 2000);
    return () => clearInterval(interval);
  }, [fetchGame]);

  // Reset stageFinished when the scene changes
  useEffect(() => {
    setStageFinished(false);
  }, [game?.currentScenarioId]);

  // Update overlay text based on state
  useEffect(() => {
    if (game?.state === 'voting') {
      setVotingOverlay('VOTING IN PROGRESS');
    } else if (game?.state === 'result') {
      setVotingOverlay('THE DARKNESS HAS SPOKEN');
    } else {
      setVotingOverlay(null);
    }
  }, [game?.state]);

  const advance = async (action: string) => {
    const res = await fetch('/api/advance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode: room, hostId, action }),
    });
    const data = await res.json();
    if (data.error) alert(data.error);
    else fetchGame();
  };

  if (!hostId) return <p className="text-blood-500 font-heading">Loading...</p>;
  if (!game) return <p className="text-blood-500 font-heading">Loading game state...</p>;

  // Lobby
  if (game.state === 'lobby') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-heading font-bold text-blood-500">GAME LOBBY</h1>
        <p className="text-gray-400 font-body">
          Room code: <span className="text-blood-400 font-heading text-xl">{room}</span>
        </p>
        <div className="bg-black border border-blood-800 p-3 rounded text-center font-mono text-blood-300">
          {typeof window !== 'undefined' ? `${window.location.origin}/join?room=${room}` : ''}
        </div>
        <p className="font-heading text-gray-400">Players joined:</p>
        <ul className="list-disc pl-5 space-y-1">
          {game.players.map((p) => (
            <li key={p.id} className="text-gray-200 font-body">{p.name}</li>
          ))}
        </ul>
        <button
          onClick={() => advance('start')}
          disabled={game.players.length === 0}
          className="bg-blood-800 hover:bg-blood-700 disabled:opacity-30 text-white font-heading text-lg tracking-widest py-2 px-8 rounded border border-blood-600 shadow-[0_0_15px_rgba(139,0,0,0.5)] transition"
        >
          START GAME
        </button>
      </div>
    );
  }

  // Determine which animated scene to show
  const currentSceneData = act1Scenes[game.currentScenarioId];
  // If we have an animated scene, use it; otherwise use a fallback (basementIntro)
  const sceneToShow = currentSceneData || basementIntro;

  // Game is active – always show the stage with possible overlay & controls
  return (
    <div className="relative w-screen h-screen">
      <Stage
        key={game.currentScenarioId} // force remount on scene change
        scene={sceneToShow}
        overlay={votingOverlay || undefined}
        onComplete={() => setStageFinished(true)}
      />

      {/* Host buttons overlaid on stage (bottom centre) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-4">
        {game.state === 'scenario' && stageFinished && (
          <button
            onClick={() => advance('open-voting')}
            className="bg-blood-800 hover:bg-blood-700 text-white font-heading text-lg tracking-widest py-2 px-8 rounded border border-blood-600 shadow-lg"
          >
            OPEN VOTING
          </button>
        )}

        {game.state === 'voting' && (
          <button
            onClick={() => advance('close-voting')}
            className="bg-blood-800 hover:bg-blood-700 text-white font-heading text-lg tracking-widest py-2 px-8 rounded border border-blood-600 shadow-lg"
          >
            CLOSE VOTING
          </button>
        )}

        {game.state === 'result' && (
          <button
            onClick={() => advance('next-scene')}
            className="bg-blood-800 hover:bg-blood-700 text-white font-heading text-lg tracking-widest py-2 px-8 rounded border border-blood-600 shadow-lg"
          >
            CONTINUE
          </button>
        )}
      </div>
    </div>
  );
}