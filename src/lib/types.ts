export interface Player {
  id: string;
  name: string;
}

export type GameState = 'lobby' | 'scenario' | 'voting' | 'result' | 'finished';

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface Scene {
  text: string;
  choices: Choice[];
  imageUrl?: string;
  videoUrl?: string;
}

export interface GameData {
  hostId: string;
  players: Player[];
  state: GameState;
  currentScenarioId: string;
  scenarioText: string;
  choices: Choice[];
  votes: Record<string, string>;
  winnerChoiceId: string | null;
  history: { scenarioId: string; winnerChoiceId: string }[];
  sceneImageUrl?: string;
  sceneVideoUrl?: string;
}