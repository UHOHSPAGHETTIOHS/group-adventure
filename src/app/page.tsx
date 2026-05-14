'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');

  const createGame = async () => {
    const res = await fetch('/api/create-game', { method: 'POST' });
    const data = await res.json();
    if (data.roomCode && data.hostId) {
      localStorage.setItem('hostId', data.hostId);
      router.push(`/host/${data.roomCode}`);
    }
  };

  const goToJoin = () => {
    router.push('/join');
  };

  const joinWithCode = () => {
    if (roomCode.trim()) {
      router.push(`/join?room=${roomCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 space-y-6">
      <h1 className="text-4xl font-bold text-center">Group Adventure</h1>
      <p className="text-gray-400 text-center">A voting-based choose-your-own-adventure game</p>
      <button
        onClick={createGame}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-lg text-lg"
      >
        Create New Game
      </button>
      <div className="flex flex-col items-center space-y-3">
        <p className="text-sm text-gray-300">Or join an existing game:</p>
        <div className="flex space-x-2">
          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Room code"
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-center uppercase text-white"
            maxLength={6}
          />
          <button
            onClick={joinWithCode}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          >
            Join
          </button>
        </div>
        <button onClick={goToJoin} className="text-indigo-400 underline text-sm">
          Join with name selection
        </button>
      </div>
    </div>
  );
}