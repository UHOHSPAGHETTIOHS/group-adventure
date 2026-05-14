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
      // Optionally handle error (game not found, etc.)
    } else {
      setGame(data);
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
    fetchGame();
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
            {game.choices.map((choice) => {
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
                    {/* Media inside the clickable button */}
                    {choice.imageUrl && (
                      <img
                        src={choice.imageUrl}
                        alt={choice.text}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    {choice.videoUrl && (
                      <div className="mb-2">
                        {choice.videoUrl.includes('youtube.com/embed') ? (
                          <iframe
                            src={choice.videoUrl}
                            title="Choice video"
                            className="w-full h-32 rounded"
                            allowFullScreen
                          />
                        ) : (
                          <video controls className="w-full h-32 rounded">
                            <source src={choice.videoUrl} type="video/mp4" />
                          </video>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span>{choice.text}</span>
                      <div className="flex space-x-2">
                        {isVoted && <span className="text-indigo-400 text-sm">✓ Your vote</span>}
                        {isWinner && <span className="text-green-400 text-sm">🏆 Winner</span>}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          {game.state === 'voting' && (
            <p className="text-sm text-gray-400 text-center">
              Vote now! You can change your vote.
            </p>
          )}
        </>
      )}

      {game.state === 'finished' && (
        <p className="text-2xl font-bold text-center text-green-400">
          🎉 The adventure has ended!
        </p>
      )}
    </div>
  );
}