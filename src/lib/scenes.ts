// ---- Types ----
export interface AvatarPosition {
  x: number;
  y: number;
}

export type SceneStep =
  | { type: "dialogue"; speaker: string; text: string }
  | { type: "action"; target: string; effect: string }
  | { type: "move_avatar"; target: string; x: number; y: number }
  | { type: "tv_alert"; text: string }
  | { type: "pause"; duration: number }
  | { type: "sound"; file: string }
  | { type: "remove_avatar"; target: string };

export interface AnimatedScene {
  background: "basement" | "upstairs" | "outside";
  positions: Record<string, AvatarPosition>;
  sequence: SceneStep[];
}

// ---- Shared basement positions ----
const basementPositions: Record<string, AvatarPosition> = {
  Dawson:  { x: 24, y: 36 }, Nick:    { x: 34, y: 34 }, Gabe:    { x: 50, y: 33 },
  Holden:  { x: 66, y: 34 }, Mark:    { x: 76, y: 36 },
  Mason:   { x: 96, y: 45 }, Ryan:    { x: 96, y: 53 },
  Sean:    { x: 72, y: 56 }, Nate:    { x: 58, y: 58 }, Jack:    { x: 42, y: 58 },
  Luke:    { x: 28, y: 56 }, Jacob:   { x: 4, y: 45 },
};

// ---- Intro (start) ----
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

// ---- Act 1 Scenes ----
export const act1Scenes: Record<string, AnimatedScene> = {
  start: basementIntro,

  // After the intro, both choices lead here
  tv_broadcast: {
    background: "basement",
    positions: basementPositions,
    sequence: [
      { type: "tv_alert", text: "🚨 Symptoms include bloodshot red eyes, excess thirst, and extreme hunger. KILL ON SIGHT. 🚨" },
      { type: "dialogue", speaker: "Holden", text: "OUUU SHII" },
      { type: "dialogue", speaker: "Gabe", text: "It's the apocalypse. The end times. The cleansing fire. I knew it. I knew the voices were right." },
      { type: "dialogue", speaker: "Holden", text: "Okay Gabe is freaking me out more than the zombie stuff." },
      { type: "dialogue", speaker: "Mason", text: "Thinking of it now Sean's dick does sound delicious." },
    ],
  },

  // Choice 1: symptom_check
  symptom_check: {
    background: "basement",
    positions: basementPositions,
    sequence: [
      { type: "dialogue", speaker: "Nick", text: "No, no, no, no, 'm too pretty to DIE. On the other hand, plenty of dead bodies for me to use." },
      { type: "dialogue", speaker: "Nate", text: "EVERYBODY SHUT THE FUCK UP. Let's go in a circle and say if we have any symptoms of sickness. I don't feel anything." },
      { type: "dialogue", speaker: "Holden", text: "Anybody have water?" },
      { type: "dialogue", speaker: "Mason", text: "Sean's dick has sounded oddly delicious lately." },
      { type: "dialogue", speaker: "Sean", text: "Stay the fuck away from me" },
      { type: "dialogue", speaker: "Jack", text: "i feel okay but my eyes are itchy." },
      { type: "dialogue", speaker: "Nick", text: "No, no, no, no, 'm too pretty to DIE. On the other hand, plenty of dead bodies for me to use." },
      { type: "dialogue", speaker: "Dawson", text: "I've been feeling curious recently." },
      { type: "dialogue", speaker: "Holden", text: "So nobody has water?" },
      { type: "dialogue", speaker: "Ryan", text: "do you guys think we can use my pancoins still? I'm hungry." },
      { type: "dialogue", speaker: "Luke", text: "When the crow flies we shall find the answers we desire." },
      { type: "dialogue", speaker: "Jacob", text: "is this my blood or one of yours in my ass" },
      { type: "dialogue", speaker: "Mark", text: "this is just like brokeback mountain" },
      { type: "dialogue", speaker: "Gabe", text: "Im going to fucking kill someone soon" },
    ],
  },

  // Choice 2: check_outside
  check_outside: {
    background: "basement",
    positions: basementPositions,
    sequence: [
      { type: "dialogue", speaker: "Nick", text: "No, no, no, no, 'm too pretty to DIE. On the other hand, plenty of dead bodies for me to use." },
      { type: "dialogue", speaker: "Nate", text: "EVERYBODY SHUT THE FUCK UP. Let's go in a circle and say if we have any symptoms of sickness. I don't feel anything." },
      { type: "dialogue", speaker: "Holden", text: "Anybody have water?" },
      { type: "dialogue", speaker: "Mason", text: "Sean's dick has sounded oddly delicious lately." },
      { type: "dialogue", speaker: "Sean", text: "Stay the fuck away from me" },
      { type: "dialogue", speaker: "Jack", text: "i feel okay but my eyes are itchy." },
      { type: "dialogue", speaker: "Nick", text: "No, no, no, no, 'm too pretty to DIE. On the other hand, plenty of dead bodies for me to use." },
      { type: "dialogue", speaker: "Dawson", text: "I've been feeling curious recently." },
      { type: "dialogue", speaker: "Holden", text: "So nobody has water?" },
      { type: "dialogue", speaker: "Ryan", text: "do you guys think we can use my pancoins still? I'm hungry." },
      { type: "dialogue", speaker: "Luke", text: "When the crow flies we shall find the answers we desire." },
      { type: "dialogue", speaker: "Jacob", text: "is this my blood or one of yours in my ass" },
      { type: "dialogue", speaker: "Mark", text: "this is just like brokeback mountain" },
      { type: "dialogue", speaker: "Gabe", text: "Im going to fucking kill someone soon" },
    ],
  },
};