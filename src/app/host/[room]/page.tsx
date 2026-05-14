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

  if (!hostId) return <p>Loading...</p>;
  if (!game) return <p>Loading game state...</p>;

  // Lobby view
  if (game.state === 'lobby') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Game Lobby – Room: {room}</h1>
        <p className="text-gray-300">Share this code with friends, or send them the link:</p>
        <div className="bg-gray-800 p-3 rounded text-center font-mono">
          {typeof window !== 'undefined' ? `${window.location.origin}/join?room=${room}` : ''}
        </div>
        <p>Players joined:</p>
        <ul className="list-disc pl-5">
          {game.players.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
        <button
          onClick={() => advance('start')}
          disabled={game.players.length === 0}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded"
        >
          Start Game
        </button>
      </div>
    );
  }

  // Calculate vote tallies
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
      <h1 className="text-2xl font-bold">Host Dashboard – Room {room}</h1>
      <div className="bg-gray-800 p-4 rounded">
        <p className="text-sm text-gray-400 mb-1">Scenario</p>
        <p className="text-xl">{game.scenarioText}</p>
      </div>

      <div>
        <p className="text-sm text-gray-400 mb-2">Choices:</p>
        <ul className="space-y-2">
          {game.choices.map((choice) => {
            const count = voteCounts[choice.id] || 0;
            const isWinner = game.winnerChoiceId === choice.id;
            return (
              <li
                key={choice.id}
                className={`p-3 rounded border ${
                  isWinner ? 'border-green-500 bg-green-900/30' : 'border-gray-700'
                }`}
              >
                {/* Media display */}
                {choice.imageUrl && (
                  <img
                    src={choice.imageUrl}
                    alt={choice.text}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                )}
                {choice.videoUrl && (
                  <div className="mb-2">
                    {choice.videoUrl.includes('youtube.com/embed') ? (
                      <iframe
                        src={choice.videoUrl}
                        title="Choice video"
                        className="w-full h-48 rounded"
                        allowFullScreen
                      />
                    ) : (
                      <video controls className="w-full h-48 rounded">
                        <source src={choice.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <span className="flex-1">{choice.text}</span>
                  {game.state === 'voting' || game.state === 'result' ? (
                    <span className="text-sm font-mono ml-2">{count} votes</span>
                  ) : null}
                </div>
                {isWinner && (
                  <p className="text-green-400 text-sm mt-1">🏆 Winning choice</p>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {game.state === 'scenario' && (
        <button
          onClick={() => advance('open-voting')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded"
        >
          Open Voting
        </button>
      )}
      {game.state === 'voting' && (
        <button
          onClick={() => advance('close-voting')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-6 rounded"
        >
          Close Voting
        </button>
      )}
      {game.state === 'result' && (
        <button
          onClick={() => advance('next-scene')}
          className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-6 rounded"
        >
          Continue to Next Scene
        </button>
      )}
      {game.state === 'finished' && (
        <p className="text-2xl font-bold text-center text-green-400">
          🎉 The adventure is over!
        </p>
      )}
    </div>
  );
}