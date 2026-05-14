import { NextResponse } from 'next/server';
import kv from '@/lib/kv';
import { GameData } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const room = searchParams.get('room');
  if (!room) return NextResponse.json({ error: 'Missing room' }, { status: 400 });

  const gameData = await kv.get<GameData>(`room:${room}`);
  if (!gameData) return NextResponse.json({ error: 'Game not found' }, { status: 404 });

  // Return public view (hide votes details if needed? For simplicity, return everything; the UI can decide what to show)
  return NextResponse.json(gameData);
}