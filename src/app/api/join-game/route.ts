import { NextResponse } from 'next/server';
import kv from '@/lib/kv';
import { GameData } from '@/lib/types';

export async function POST(request: Request) {
  const { roomCode, playerName } = await request.json();
  if (!roomCode || !playerName) {
    return NextResponse.json({ error: 'Missing room code or name' }, { status: 400 });
  }

  const key = `room:${roomCode}`;
  const gameData = await kv.get<GameData>(key);
  if (!gameData) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  if (gameData.state !== 'lobby') {
    return NextResponse.json({ error: 'Game already started' }, { status: 403 });
  }

  const playerId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36);
  gameData.players.push({ id: playerId, name: playerName });
  await kv.set(key, gameData);

  return NextResponse.json({ playerId, playerName });
}