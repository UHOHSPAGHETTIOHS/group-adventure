'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GameData } from '@/lib/types';

export default function HostPage() {
  const params = useParams();
  const room = params.room as string;
  const router = useRouter();
  const [hostId, setHostId] = useState<string | null>(null);
  const [game, setGame] = useState<GameData | null>(null);
  const [error, setError] = useState('');

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

  if (game.state === 'lobby') {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-heading font-bold text-blood-500">GAME LOBBY</h1>
        <p className="text-gray-400 font-body">Room code: <span className="text-blood-400 font-heading text-xl">{room}</span></p>
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

  const getVoteCounts = () => {
    if (!game || (game.state !== 'voting' && game.state !== 'result')) return {};
    const tally: Record<string, number> = {};
    for (const choiceId of Object.values(game.votes)) {
      tally[choiceId] = (tally[choiceId] || 0) + 1;
    }
    return tally;
  };

  const voteCounts = getVoteCounts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-blood-400 tracking-wider">
        HOST DASHBOARD – {room}
      </h1>

      {/* Scene media + text */}
      <div className="bg-black border border-blood-800 rounded overflow-hidden shadow-[0_0_20px_rgba(139,0,0,0.15)]">
        {game.sceneImageUrl && (
          <img src={game.sceneImageUrl} alt="Scene" className="w-full max-h-96 object-cover" />
        )}
        {game.sceneVideoUrl && (
          <div className="w-full">
            {game.sceneVideoUrl.includes('youtube.com/embed') ? (
              <iframe src={game.sceneVideoUrl} className="w-full h-64 md:h-96" allowFullScreen />
            ) : (
              <video controls className="w-full max-h-96">
                <source src={game.sceneVideoUrl} type="video/mp4" />
              </video>
            )}
          </div>
        )}
        <p className="p-4 text-xl font-body text-gray-200 leading-relaxed">{game.scenarioText}</p>
      </div>

      {/* Choices */}
      <div>
        <p className="text-sm font-heading text-gray-500 mb-3 tracking-wider">CHOICES</p>
        <ul className="space-y-3">
          {game.choices.map((choice) => {
            const count = voteCounts[choice.id] || 0;
            const isWinner = game.winnerChoiceId === choice.id;
            return (
              <li
                key={choice.id}
                className={`p-3 rounded border font-heading tracking-wide transition-all duration-200
                  ${isWinner ? 'border-blood-600 bg-blood-950/40 shadow-[0_0_10px_rgba(139,0,0,0.4)]' : 'border-blood-800 bg-black'}
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-100 text-lg">{choice.text}</span>
                  {game.state === 'voting' || game.state === 'result' ? (
                    <span className="text-sm font-mono text-blood-300 ml-2">{count} votes</span>
                  ) : null}
                </div>
                {isWinner && (
                  <p className="text-blood-400 text-sm mt-1 font-body italic">— The darkness chooses —</p>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Host controls */}
      <div className="flex gap-4">
        {game.state === 'scenario' && (
          <button
            onClick={() => advance('open-voting')}
            className="flex-1 py-2 bg-blood-800 hover:bg-blood-700 text-white font-heading text-lg tracking-widest rounded border border-blood-600 shadow-[0_0_15px_rgba(139,0,0,0.5)] transition"
          >
            OPEN VOTING
          </button>
        )}
        {game.state === 'voting' && (
          <button
            onClick={() => advance('close-voting')}
            className="flex-1 py-2 bg-blood-800 hover:bg-blood-700 text-white font-heading text-lg tracking-widest rounded border border-blood-600 transition"
          >
            CLOSE VOTING
          </button>
        )}
        {game.state === 'result' && (
          <button
            onClick={() => advance('next-scene')}
            className="flex-1 py-2 bg-blood-800 hover:bg-blood-700 text-white font-heading text-lg tracking-widest rounded border border-blood-600 transition"
          >
            CONTINUE
          </button>
        )}
        {game.state === 'finished' && (
          <p className="text-2xl font-heading font-bold text-blood-500 text-center w-full">
            THE END
          </p>
        )}
      </div>
    </div>
  );
}