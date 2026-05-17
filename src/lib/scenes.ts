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
  // Top side (just above the table)
  Dawson:  { x: 25, y: 33 },
  Nick:    { x: 35, y: 31 },
  Gabe:    { x: 50, y: 30 },
  Holden:  { x: 65, y: 31 },
  Mark:    { x: 75, y: 33 },

  // Right side (just to the right of the table)
  Mason:   { x: 93, y: 42 },
  Ryan:    { x: 93, y: 48 },

  // Bottom side (just below the table)
  Sean:    { x: 72, y: 57 },
  Nate:    { x: 58, y: 58 },
  Jack:    { x: 42, y: 58 },
  Luke:    { x: 28, y: 57 },

  // Left side (just to the left of the table)
  Jacob:   { x: 7, y: 42 },
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