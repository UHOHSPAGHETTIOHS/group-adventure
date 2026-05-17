// ---- Types ----
export interface AvatarPosition {
  x: number;
  y: number;
}

export type SceneStep =
  | { type: "dialogue"; speaker: string; text: string }
  | { type: "action"; target: string; effect: string }      // shake, twitch
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

  tv_broadcast: {
    background: "basement",
    positions: basementPositions,
    sequence: [
      { type: "dialogue", speaker: "Mark", text: "That was the emergency broadcast! They're telling everyone to stay inside. This is just like Night of the Living Dead!" },
      { type: "dialogue", speaker: "Gabe", text: "It's the apocalypse. The end times. The cleansing fire. I knew it. I knew the voices were right." },
      { type: "dialogue", speaker: "Holden", text: "Okay Gabe is freaking me out more than the zombie stuff." },
      { type: "sound", file: "mason_growl.mp3" },
      { type: "dialogue", speaker: "Mason", text: "FLESH! I need FLESH!" },
      { type: "action", target: "Mason", effect: "shake" },
      { type: "dialogue", speaker: "Sean", text: "I got good dick right here for you Mason." },
    ],
  },

  tie_mason: {
    background: "basement",
    positions: {
      ...basementPositions,
      // Mason will be moved to the corner during the scene – we keep his initial position here for now
      Mason: { x: 96, y: 45 },
    },
    sequence: [
      { type: "dialogue", speaker: "Dawson", text: "Jack, Nate, Jacob – grab him. We're tying him to that chair." },
      // Three avatars move toward Mason
      { type: "move_avatar", target: "Jack", x: 90, y: 45 },
      { type: "move_avatar", target: "Nate", x: 88, y: 48 },
      { type: "move_avatar", target: "Jacob", x: 85, y: 45 },
      { type: "pause", duration: 800 },
      { type: "sound", file: "struggle.mp3" },
      { type: "action", target: "Mason", effect: "shake" },
      { type: "dialogue", speaker: "Mason", text: "You'll regret this! I'll eat your brains! And then I'll sue you for illegal imprisonment!" },
      // Move them back to their original seats
      { type: "move_avatar", target: "Jack", x: 42, y: 58 },
      { type: "move_avatar", target: "Nate", x: 58, y: 58 },
      { type: "move_avatar", target: "Jacob", x: 4, y: 45 },
      { type: "pause", duration: 1000 },
      { type: "dialogue", speaker: "Sean", text: "Guys, we can't just leave him like that. He's sick. Maybe we can find a cure?" },
      { type: "dialogue", speaker: "Dawson", text: "We need to secure the basement. Board up the windows and the door. Then we can search the house for supplies." },
      { type: "sound", file: "board_up.mp3" },
      { type: "pause", duration: 2000 },
      { type: "dialogue", speaker: "Nate", text: "I found some nails and a few planks. Let's do this." },
    ],
  },

  flee_basement: {
    background: "basement",
    positions: basementPositions,
    sequence: [
      { type: "dialogue", speaker: "Nick", text: "Oh god oh god oh god. I'm too pretty to die! Let's just run!" },
      { type: "dialogue", speaker: "Gabe", text: "Running is smart. We'll find weapons upstairs. Follow me." },
      { type: "action", target: "Gabe", effect: "shake" },
      { type: "dialogue", speaker: "Dawson", text: "Wait! We need a plan. At least grab something to defend ourselves." },
      { type: "sound", file: "mason_roar.mp3" },
      { type: "dialogue", speaker: "Mason", text: "You can't leave me! I'll break free and find you!" },
      { type: "action", target: "Mason", effect: "twitch" },
      { type: "pause", duration: 1000 },
      { type: "dialogue", speaker: "Holden", text: "He's getting loose! Run!" },
    ],
  },

  // Placeholder scenes – adjust backgrounds and sequences later
  upstairs_hallway: {
    background: "basement", // change to "upstairs" once you have the CSS room
    positions: {
      ...basementPositions,
      Mason: { x: -999, y: -999 },   // hide Mason
    },
    sequence: [
      { type: "dialogue", speaker: "Ryan", text: "It's dark up here. I think I saw a duck." },
      { type: "dialogue", speaker: "Jacob", text: "Ryan, there's no duck! Focus!" },
      { type: "dialogue", speaker: "Mark", text: "According to every zombie movie, we should check for weapons. Bathroom, kitchen, bedrooms." },
      { type: "dialogue", speaker: "Gabe", text: "I'll check the kitchen. Knives are good. Very good." },
    ],
  },

  stay_basement: {
    background: "basement",
    positions: basementPositions,
    sequence: [
      { type: "dialogue", speaker: "Sean", text: "We're safe here. The barricade will hold. Let's just wait for help." },
      { type: "sound", file: "banging_door.mp3" },
      { type: "dialogue", speaker: "Luke", text: "Did you hear that? It's the zombies! They're trying to get in!" },
      { type: "action", target: "Luke", effect: "shake" },
      { type: "dialogue", speaker: "Dawson", text: "Stay calm. The door is sturdy. But we can't just sit here forever." },
    ],
  },

  outside_yard: {
    background: "outside",
    positions: {
      ...basementPositions,
      Mason: { x: -999, y: -999 },
    },
    sequence: [
      { type: "dialogue", speaker: "Holden", text: "We're outside. The zombies are everywhere!" },
      { type: "sound", file: "zombie_attack.mp3" },
      { type: "dialogue", speaker: "Dawson", text: "Get to the truck! Now!" },
    ],
  },
};