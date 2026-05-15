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
    <div className="flex flex-col items-center mt-20 space-y-8">
      <h1 className="text-5xl font-heading font-bold text-blood-500 tracking-widest">
        Group Adventure
      </h1>
      <p className="text-lg text-gray-400 font-body text-center max-w-md">
        A dark, voting-based journey into the unknown.
      </p>
      <button
        onClick={createGame}
        className="px-8 py-3 bg-blood-800 hover:bg-blood-700 text-white font-heading text-lg tracking-wider border border-blood-600 rounded transition-all duration-300 shadow-[0_0_15px_rgba(139,0,0,0.4)]"
      >
        Create New Game
      </button>
      <div className="flex flex-col items-center space-y-4">
        <p className="text-sm text-gray-500 font-heading tracking-wide">OR JOIN EXISTING</p>
        <div className="flex space-x-2">
          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="ROOM CODE"
            className="bg-black border border-blood-800 rounded px-4 py-2 text-center uppercase font-heading text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blood-500 w-28"
            maxLength={6}
          />
          <button
            onClick={joinWithCode}
            className="px-4 py-2 bg-black border border-blood-800 hover:border-blood-500 text-blood-400 font-heading text-sm tracking-wider rounded transition"
          >
            Join
          </button>
        </div>
        <button onClick={goToJoin} className="text-blood-500 hover:text-blood-300 text-sm font-heading underline">
          Join with name
        </button>
      </div>
    </div>
  );
}