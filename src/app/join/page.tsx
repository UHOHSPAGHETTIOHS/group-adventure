'use client';

import { Suspense } from 'react';

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-blood-400 font-heading">Loading...</div>}>
      <JoinForm />
    </Suspense>
  );
}

function JoinForm() {
  const { useSearchParams, useRouter } = require('next/navigation');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { useState } = require('react');

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
    <div className="max-w-md mx-auto mt-20 space-y-6">
      <h1 className="text-3xl font-heading font-bold text-center text-blood-500">Join the Darkness</h1>
      <div>
        <label className="block text-sm font-heading text-gray-400 mb-1">ROOM CODE</label>
        <input
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          className="w-full bg-black border border-blood-800 rounded px-4 py-2 text-center uppercase font-heading text-gray-200 placeholder-gray-600"
          maxLength={6}
          placeholder="XXXXXX"
        />
      </div>
      <div>
        <label className="block text-sm font-heading text-gray-400 mb-1">YOUR NAME</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-black border border-blood-800 rounded px-4 py-2 font-body text-gray-200 placeholder-gray-600"
          placeholder="Enter your name"
        />
      </div>
      {error && <p className="text-blood-400 text-sm font-heading">{error}</p>}
      <button
        onClick={handleJoin}
        disabled={joining}
        className="w-full py-3 bg-blood-800 hover:bg-blood-700 disabled:opacity-50 text-white font-heading text-lg tracking-wider rounded border border-blood-600 transition shadow-[0_0_10px_rgba(139,0,0,0.4)]"
      >
        {joining ? 'JOINING...' : 'JOIN'}
      </button>
    </div>
  );
}