// Avatar positions on the stage (x,y percentages relative to the container)
// Existing types...
export interface AvatarPosition {
  x: number;
  y: number;
}

export type SceneStep =
  | { type: "dialogue"; speaker: string; text: string }
  | { type: "action"; target: string; effect: string }
  | { type: "tv_alert"; text: string }
  | { type: "pause"; duration: number }
  | { type: "sound"; file: string }              // plays a sound from /public/sounds/
  | { type: "remove_avatar"; target: string };   // hides the avatar (death/exit)

export interface AnimatedScene {
  background: "basement"; // we'll use CSS room
  positions: Record<string, AvatarPosition>;
  sequence: SceneStep[];
}

// --- The intro scene ---
const avatarPositions: Record<string, AvatarPosition> = {
  // ---- Top side (just above the table) ----
  Dawson:  { x: 24, y: 36 },   // y slightly less than table top (38%)
  Nick:    { x: 34, y: 34 },
  Gabe:    { x: 50, y: 33 },
  Holden:  { x: 66, y: 34 },
  Mark:    { x: 76, y: 36 },

  // ---- Right side (to the right of the table) ----
  Mason:   { x: 96, y: 45 },   // x > 92% so outside table
  Ryan:    { x: 96, y: 53 },   // further down, no collision

  // ---- Bottom side (just below the table) ----
  Sean:    { x: 72, y: 56 },   // y > 52% + a little
  Nate:    { x: 58, y: 58 },
  Jack:    { x: 42, y: 58 },
  Luke:    { x: 28, y: 56 },

  // ---- Left side (to the left of the table) ----
  Jacob:   { x: 4, y: 45 },    // x < 8%
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