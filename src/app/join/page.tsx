'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomCode, setRoomCode] = useState(searchParams.get('room') || '');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    setError('');
    if (!roomCode.trim() || !name.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setJoining(true);
    const res = await fetch('/api/join-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode: roomCode.trim().toUpperCase(), playerName: name.trim() }),
    });
    const data = await res.json();
    setJoining(false);
    if (data.error) {
      setError(data.error);
    } else {
      localStorage.setItem('playerId', data.playerId);
      localStorage.setItem('playerName', data.playerName);
      router.push(`/play/${roomCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 space-y-5">
      <h1 className="text-3xl font-bold text-center">Join Game</h1>
      <div>
        <label className="block text-sm mb-1">Room Code</label>
        <input
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-center uppercase"
          maxLength={6}
          placeholder="ABCD12"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Your Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2"
          placeholder="Alex"
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        onClick={handleJoin}
        disabled={joining}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg"
      >
        {joining ? 'Joining...' : 'Join Game'}
      </button>
    </div>
  );
}