import { NextResponse } from 'next/server';
import kv from '@/lib/kv';
import { GameData } from '@/lib/types';
import { story } from '@/lib/story';

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36);
}

export async function POST() {
  const hostId = generateId();
  const roomCode = generateRoomCode();
  const initialScene = story['start'];

  const gameData: GameData = {
    hostId,
    players: [],
    state: 'lobby',
    currentScenarioId: 'start',
    scenarioText: initialScene.text,
    choices: initialScene.choices,
    votes: {},
    winnerChoiceId: null,
    history: [],
    sceneImageUrl: initialScene.imageUrl,
    sceneVideoUrl: initialScene.videoUrl,
  };

  await kv.set(`room:${roomCode}`, gameData);
  return NextResponse.json({ roomCode, hostId });
}