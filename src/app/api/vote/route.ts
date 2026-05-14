import { NextResponse } from 'next/server';
import kv from '@/lib/kv';
import { GameData } from '@/lib/types';

export async function POST(request: Request) {
  const { roomCode, playerId, choiceId } = await request.json();
  if (!roomCode || !playerId || !choiceId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const key = `room:${roomCode}`;
  const gameData = await kv.get<GameData>(key);
  if (!gameData) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

  if (gameData.state !== 'voting') {
    return NextResponse.json({ error: 'Voting not open' }, { status: 403 });
  }

  // Check if choice is valid
  const validChoice = gameData.choices.find(c => c.id === choiceId);
  if (!validChoice) {
    return NextResponse.json({ error: 'Invalid choice' }, { status: 400 });
  }

  // Allow re-voting (overwrite)
  gameData.votes[playerId] = choiceId;
  await kv.set(key, gameData);

  return NextResponse.json({ success: true });
}