export interface Player {
  id: string;
  name: string;
  avatarId: string;
}

export type GameState = 'lobby' | 'scenario' | 'voting' | 'result' | 'finished';

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  imageUrl?: string;
  videoUrl?: string;
  givesItem?: string;          // item added to inventory when this choice wins
  requiresItem?: string;       // item required to select this choice (player vote only)
  removesItem?: string;        // item removed from inventory after this choice wins
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
  inventory: string[];          // new: items the group currently holds
}