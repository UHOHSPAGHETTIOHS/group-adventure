import { NextResponse } from 'next/server';
import kv from '@/lib/kv';
import { GameData } from '@/lib/types';
import { story } from '@/lib/story';

export async function POST(request: Request) {
  const { roomCode, hostId, action } = await request.json();
  if (!roomCode || !hostId || !action) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const key = `room:${roomCode}`;
  const gameData = await kv.get<GameData>(key);
  if (!gameData) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  if (gameData.hostId !== hostId) {
    return NextResponse.json({ error: 'Not the host' }, { status: 403 });
  }

  switch (action) {
   case 'start': {
  if (gameData.state !== 'lobby') return NextResponse.json({ error: 'Game already started' }, { status: 400 });
  gameData.state = 'scenario';

  // Set the first voting prompt (players will see a short text)
  gameData.scenarioText = "What do you do?";
  gameData.choices = [
    { id: "listen_broadcast", text: "Listen to the emergency broadcast", nextSceneId: "tv_broadcast" },
    { id: "touch_jacob", text: "Touch Jacob, then listen to the broadcast", nextSceneId: "tv_broadcast" },
  ];

  await kv.set(key, gameData);
  return NextResponse.json({ success: true });
}

    case 'open-voting': {
      if (gameData.state !== 'scenario')
        return NextResponse.json({ error: 'Cannot open voting now' }, { status: 400 });
      gameData.state = 'voting';
      gameData.votes = {};
      gameData.winnerChoiceId = null;
      await kv.set(key, gameData);
      return NextResponse.json({ success: true });
    }

    case 'close-voting': {
      if (gameData.state !== 'voting')
        return NextResponse.json({ error: 'Voting not open' }, { status: 400 });

      const tally: Record<string, number> = {};
      for (const choiceId of Object.values(gameData.votes)) {
        tally[choiceId] = (tally[choiceId] || 0) + 1;
      }
      let maxVotes = 0;
      let winners: string[] = [];
      for (const [choiceId, count] of Object.entries(tally)) {
        if (count > maxVotes) {
          maxVotes = count;
          winners = [choiceId];
        } else if (count === maxVotes) {
          winners.push(choiceId);
        }
      }
      if (winners.length === 0) {
        winners = [gameData.choices[0].id];
      }
      const winner = winners[Math.floor(Math.random() * winners.length)];
      gameData.winnerChoiceId = winner;
      gameData.state = 'result';
      gameData.history.push({ scenarioId: gameData.currentScenarioId, winnerChoiceId: winner });
      await kv.set(key, gameData);
      return NextResponse.json({ success: true, winnerChoiceId: winner });
    }

    case 'next-scene': {
      if (gameData.state !== 'result')
        return NextResponse.json({ error: 'No result to advance from' }, { status: 400 });

      const winnerChoice = gameData.choices.find(c => c.id === gameData.winnerChoiceId);
      if (!winnerChoice)
        return NextResponse.json({ error: 'Invalid winner choice' }, { status: 500 });

      const nextSceneId = winnerChoice.nextSceneId;
      const nextScene = story[nextSceneId];
      if (!nextScene) return NextResponse.json({ error: 'Scene not found' }, { status: 500 });

      gameData.currentScenarioId = nextSceneId;
      gameData.scenarioText = nextScene.text;
      gameData.choices = nextScene.choices;
      gameData.sceneImageUrl = nextScene.imageUrl;
      gameData.sceneVideoUrl = nextScene.videoUrl;
      gameData.state = nextScene.choices.length > 0 ? 'scenario' : 'finished';
      gameData.votes = {};
      gameData.winnerChoiceId = null;

      await kv.set(key, gameData);
      return NextResponse.json({ success: true });
    }

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}