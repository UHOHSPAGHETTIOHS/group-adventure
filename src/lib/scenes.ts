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
  Dawson:  { x: 15, y: 25 },
  Nick:    { x: 30, y: 15 },
  Gabe:    { x: 50, y: 12 },
  Holden:  { x: 68, y: 15 },
  Mark:    { x: 82, y: 25 },
  Mason:   { x: 85, y: 55 }, // sitting at the end of table
  Ryan:    { x: 70, y: 75 },
  Sean:    { x: 50, y: 80 },
  Nate:    { x: 30, y: 78 },
  Jack:    { x: 15, y: 60 },
  Luke:    { x: 45, y: 30 }, // middle of table, directly across from Mason?
  Jacob:   { x: 60, y: 35 },
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