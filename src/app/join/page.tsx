'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { availableAvatars } from '@/lib/avatars';

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-blood-400 font-heading">Loading...</div>}>
      <JoinForm />
    </Suspense>
  );
}

function JoinForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [roomCode, setRoomCode] = useState(searchParams.get('room') || '');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(availableAvatars[0]?.id || '');
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    setError('');

    if (!roomCode.trim() || !name.trim() || !selectedAvatar) {
      setError('Please fill in all fields and choose an avatar');
      return;
    }

    setJoining(true);
    const res = await fetch('/api/join-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomCode: roomCode.trim().toUpperCase(),
        playerName: name.trim(),
        avatarId: selectedAvatar,
      }),
    });
    const data = await res.json();
    setJoining(false);

    if (data.error) {
      setError(data.error);
    } else {
      localStorage.setItem('playerId', data.playerId);
      localStorage.setItem('playerName', data.playerName);
      localStorage.setItem('avatarId', selectedAvatar);
      router.push(`/play/${roomCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
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

      <div>
        <label className="block text-sm font-heading text-gray-400 mb-3">CHOOSE YOUR AVATAR</label>
        <div className="grid grid-cols-3 gap-3">
          {availableAvatars.map((ava) => (
            <button
              key={ava.id}
              type="button"
              onClick={() => setSelectedAvatar(ava.id)}
              className={`p-2 rounded border-2 transition ${
                selectedAvatar === ava.id
                  ? 'border-blood-500 shadow-[0_0_10px_rgba(139,0,0,0.5)]'
                  : 'border-blood-800 hover:border-blood-600'
              }`}
            >
              <img src={ava.idleUrl} alt={ava.name} className="w-full h-20 object-contain mx-auto" />
              <p className="text-xs font-heading text-gray-300 mt-1">{ava.name}</p>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-blood-400 text-sm font-heading">{error}</p>}

      <button
        onClick={handleJoin}
        disabled={joining}
        className="w-full py-3 bg-blood-800 hover:bg-blood-700 disabled:opacity-50 text-white font-heading text-lg tracking-widest rounded border border-blood-600 transition shadow-[0_0_10px_rgba(139,0,0,0.4)]"
      >
        {joining ? 'JOINING...' : 'JOIN'}
      </button>
    </div>
  );
}