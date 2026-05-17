// Avatar positions on the stage (x,y percentages relative to the container)
export interface AvatarPosition {
  x: number; // percent from left
  y: number; // percent from top
}

// A single step in the animation sequence
export type SceneStep =
  | { type: "dialogue"; speaker: string; text: string }
  | { type: "action"; target: string; effect: string } // e.g., "shake", "lunge"
  | { type: "tv_alert"; text: string }
  | { type: "pause"; duration: number };

export interface AnimatedScene {
  background: "basement"; // we'll use CSS room
  positions: Record<string, AvatarPosition>;
  sequence: SceneStep[];
}

// --- The intro scene ---
const avatarPositions: Record<string, AvatarPosition> = {
  // top side of table (y ~6-8%)
  Dawson:  { x: 25, y: 7 },
  Nick:    { x: 35, y: 5 },
  Gabe:    { x: 50, y: 4 },
  Holden:  { x: 65, y: 5 },
  Mark:    { x: 75, y: 7 },

  // right side of table (x ~85%, y around 12-18%)
  Mason:   { x: 88, y: 14 },
  Ryan:    { x: 88, y: 20 },

  // bottom side of table (y ~22-24%)
  Sean:    { x: 70, y: 24 },
  Nate:    { x: 55, y: 25 },
  Jack:    { x: 40, y: 25 },
  Luke:    { x: 30, y: 24 },

  // left side of table (x ~12%, y around 12-18%)
  Jacob:   { x: 12, y: 14 },
};

export const basementIntro: AnimatedScene = {
  background: "basement",
  positions: avatarPositions,
  sequence: [
    // Everyone sits silently for a moment
    { type: "pause", duration: 1500 },
    // Luke slams fist
    { type: "action", target: "Luke", effect: "shake" },
    { type: "dialogue", speaker: "Luke", text: "IT'S MASON! He's the witch! Look at his eyes! Burn him!" },
    { type: "pause", duration: 2000 },
    // Mason smirks
    { type: "action", target: "Mason", effect: "twitch" },
    { type: "dialogue", speaker: "Mason", text: "You're such an idiot, Luke. I'm not a witch. But I am about to make you all very, very sorry." },
    { type: "pause", duration: 2000 },
    // TV alarm
    { type: "tv_alert", text: "🚨 EMERGENCY ALERT: THE DEAD ARE WALKING! DO NOT GO OUTSIDE! 🚨" },
    { type: "pause", duration: 3000 },
  ],
};