'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GameData } from '@/lib/types';

export default function PlayPage() {
  const params = useParams();
  const room = params.room as string;
  const router = useRouter();
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [game, setGame] = useState<GameData | null>(null);
  const [votedChoice, setVotedChoice] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('playerId');
    const name = localStorage.getItem('playerName');
    if (!id || !name) {
      router.push('/join');
      return;
    }
    setPlayerId(id);
    setPlayerName(name);
  }, [router]);

  const fetchGame = useCallback(async () => {
    if (!room) return;
    const res = await fetch(`/api/game-state?room=${room}`);
    const data = await res.json();
    if (data.error) {
      // Maybe game ended or not found
    } else {
      setGame(data);
      // Set current vote of this player
      if (data.votes && playerId) {
        setVotedChoice(data.votes[playerId] || null);
      }
    }
  }, [room, playerId]);

  useEffect(() => {
    fetchGame();
    const interval = setInterval(fetchGame, 2000);
    return () => clearInterval(interval);
  }, [fetchGame]);

  const castVote = async (choiceId: string) => {
    if (!playerId || !room) return;
    await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode: room, playerId, choiceId }),
    });
    fetchGame(); // immediate update
  };

  if (!playerId || !game) {
    return <p className="text-center mt-20">Loading game...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Room {room}</h1>
        <span className="text-gray-400">Playing as {playerName}</span>
      </div>

      {/* Scenario text always visible */}
      <div className="bg-gray-800 p-4 rounded">
        <p className="text-lg">{game.scenarioText}</p>
      </div>

      {game.state === 'lobby' && (
        <p className="text-center text-gray-300">Waiting for the host to start the game...</p>
      )}

      {(game.state === 'scenario' || game.state === 'voting' || game.state === 'result') && (
        <>
          <p className="text-sm text-gray-400">Choices:</p>
          <ul className="space-y-3">
            {game.choices.map(choice => {
              const isVoted = votedChoice === choice.id;
              const isWinner = game.winnerChoiceId === choice.id;
              const canVote = game.state === 'voting';

              return (
                <li key={choice.id}>
                  <button
                    onClick={() => canVote && castVote(choice.id)}
                    disabled={!canVote}
                    className={`w-full text-left p-3 rounded border transition
                      ${isWinner ? 'border-green-500 bg-green-900/30' : 'border-gray-700'}
                      ${isVoted ? 'ring-2 ring-indigo-400' : ''}
                      ${canVote ? 'hover:bg-gray-700 cursor-pointer' : 'opacity-70 cursor-default'}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <span>{choice.text}</span>
                      {isVoted && <span className="text-indigo-400 text-sm ml-2">✓ Your vote</span>}
                      {isWinner && <span className="text-green-400 text-sm ml-2">🏆 Winner</span>}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          {game.state === 'voting' && (
            <p className="text-sm text-gray-400 text-center">Vote now! You can change your vote.</p>
          )}
        </>
      )}

      {game.state === 'finished' && (
        <p className="text-2xl font-bold text-center text-green-400">🎉 The adventure has ended!</p>
      )}
    </div>
  );
}
