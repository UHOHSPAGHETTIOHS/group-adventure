export interface Player {
  id: string;
  name: string;
}

export type GameState = 'lobby' | 'scenario' | 'voting' | 'result' | 'finished';
export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;  // the scene to go to if this choice wins
}

export interface GameData {
  hostId: string;
  players: Player[];
  state: GameState;
  currentScenarioId: string;
  scenarioText: string;
  choices: Choice[];
  votes: Record<string, string>;   // playerId -> choiceId
  winnerChoiceId: string | null;
  history: { scenarioId: string; winnerChoiceId: string }[];
}