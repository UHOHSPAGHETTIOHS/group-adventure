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
    if (!data.error) {
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
    return <p className="text-center mt-20 text-blood-400 font-heading">Awaiting darkness...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-blood-500">ROOM {room}</h1>
        <span className="text-gray-500 font-heading text-sm">{playerName}</span>
      </div>

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
        <p className="p-4 text-lg font-body text-gray-200 leading-relaxed">{game.scenarioText}</p>
      </div>

      {game.state === 'lobby' && (
        <p className="text-center text-gray-500 font-heading">Waiting for the host to begin...</p>
      )}

      {(game.state === 'scenario' || game.state === 'voting' || game.state === 'result') && (
        <>
          <p className="text-sm font-heading text-gray-500 tracking-wider">CHOOSE YOUR FATE</p>
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
                    className={`w-full text-left p-3 rounded border font-heading tracking-wide transition-all duration-200
                      ${isWinner ? 'border-blood-600 bg-blood-950/40 shadow-[0_0_10px_rgba(139,0,0,0.4)]' : 'border-blood-800 bg-black'}
                      ${isVoted ? 'ring-2 ring-blood-500' : ''}
                      ${canVote ? 'hover:bg-blood-950 hover:border-blood-500 cursor-pointer' : 'opacity-70 cursor-default'}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-100 text-lg">{choice.text}</span>
                      <div className="flex space-x-2">
                        {isVoted && <span className="text-blood-400 text-sm">✓ YOUR VOTE</span>}
                        {isWinner && <span className="text-blood-400 text-sm">🏆 CHOSEN</span>}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          {game.state === 'voting' && (
            <p className="text-center text-gray-500 text-sm font-heading">Vote now. Your fate is not yet sealed.</p>
          )}
        </>
      )}

      {game.state === 'finished' && (
        <p className="text-3xl font-heading font-bold text-blood-500 text-center">THE END</p>
      )}
    </div>
  );
}