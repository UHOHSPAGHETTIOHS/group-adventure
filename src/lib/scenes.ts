// ---- Avatar positions ----
export interface AvatarPosition {
  x: number; // percent from left
  y: number; // percent from top
}

export type SceneStep =
  | { type: "dialogue"; speaker: string; text: string }
  | { type: "action"; target: string; effect: string }
  | { type: "tv_alert"; text: string }
  | { type: "pause"; duration: number }
  | { type: "sound"; file: string }
  | { type: "remove_avatar"; target: string };

export interface AnimatedScene {
  background: "basement" | "upstairs" | "outside";
  positions: Record<string, AvatarPosition>;
  sequence: SceneStep[];
}

// ---- Basement intro (start scene) ----
const basementPositions: Record<string, AvatarPosition> = {
  Dawson:  { x: 24, y: 36 }, Nick:    { x: 34, y: 34 }, Gabe:    { x: 50, y: 33 },
  Holden:  { x: 66, y: 34 }, Mark:    { x: 76, y: 36 },
  Mason:   { x: 96, y: 45 }, Ryan:    { x: 96, y: 53 },
  Sean:    { x: 72, y: 56 }, Nate:    { x: 58, y: 58 }, Jack:    { x: 42, y: 58 },
  Luke:    { x: 28, y: 56 }, Jacob:   { x: 4, y: 45 },
};

export const basementIntro: AnimatedScene = {
  background: "basement",
  positions: basementPositions,
  sequence: [
    { type: "pause", duration: 1500 },
    { type: "action", target: "Luke", effect: "shake" },
    { type: "dialogue", speaker: "Luke", text: "IT'S MASON! He's the witch! Look at his eyes! Burn him!" },
    { type: "action", target: "Mason", effect: "twitch" },
    { type: "dialogue", speaker: "Mason", text: "You're such an idiot, Luke. I'm not a witch. But I am about to make you all very, very sorry." },
    { type: "tv_alert", text: "🚨 EMERGENCY ALERT: THE DEAD ARE WALKING! DO NOT GO OUTSIDE! 🚨" },
  ],
};

// ---- Other Act 1 scenes ----
export const act1Scenes: Record<string, AnimatedScene> = {
  start: basementIntro,  // reuse the same intro

  // Add additional scenes here later (tv_broadcast, tie_mason, etc.)
};