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
  // around the table (top center)
  Dawson:  { x: 25, y: 20 },
  Nick:    { x: 35, y: 18 },
  Gabe:    { x: 50, y: 15 },
  Holden:  { x: 65, y: 18 },
  Mark:    { x: 75, y: 20 },
  Mason:   { x: 80, y: 30 },  // right side of table
  Ryan:    { x: 75, y: 40 },
  Sean:    { x: 65, y: 42 },
  Nate:    { x: 50, y: 45 },
  Jack:    { x: 35, y: 42 },
  Luke:    { x: 25, y: 40 },
  Jacob:   { x: 20, y: 30 },  // left side of table
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