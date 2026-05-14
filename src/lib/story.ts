import { Choice } from './types';

export interface Scene {
  text: string;
  choices: Choice[];
  imageUrl?: string;
  videoUrl?: string;
}

export const story: Record<string, Scene> = {
  start: {
    text: "You and your friends wake up in an abandoned cabin in the woods. The front door is locked, and the windows are boarded. You hear scratching coming from the attic.",
    imageUrl: "/images/cabin.webp",   // example scene image
    choices: [
      { id: "attic", text: "Investigate the attic", nextSceneId: "attic" },
      { id: "basement", text: "Search for a basement entrance", nextSceneId: "basement" },
      { id: "stay", text: "Stay together and barricade the living room", nextSceneId: "barricade" },
    ],
  },
  attic: {
    text: "The attic stairs creak loudly. At the top, you find an old radio and a diary. The radio crackles: 'Don't trust the one who has the key.'",
    imageUrl: "/images/attic.jpg",
    choices: [
      { id: "radio", text: "Try to use the radio to call for help", nextSceneId: "radio_help" },
      { id: "diary", text: "Read the diary carefully", nextSceneId: "diary_read" },
      { id: "back_down", text: "Go back down immediately", nextSceneId: "barricade" },
    ],
  },
  basement: {
    text: "The basement door is hidden behind a shelf. It's dark and smells of damp earth. You hear a faint drip of water and a low, rhythmic thumping.",
    imageUrl: "/images/basement.jpg",
    choices: [
      { id: "explore_basement", text: "Descend with a flashlight", nextSceneId: "basement_creature" },
      { id: "turn_back", text: "This feels wrong – go back up", nextSceneId: "barricade" },
    ],
  },
  barricade: {
    text: "You push furniture against the doors. The scratching stops, then suddenly something slams against the front door. It won't hold long.",
    choices: [
      { id: "run_back", text: "Run to the kitchen and look for a back exit", nextSceneId: "kitchen" },
      { id: "fight", text: "Arm yourselves with fireplace tools and make a stand", nextSceneId: "final_stand" },
      { id: "hide", text: "Hide in the closets and hope it passes", nextSceneId: "hiding" },
    ],
  },
  radio_help: {
    text: "You fiddle with the radio and manage to send a distress call. A voice answers: 'Stay where you are, help is coming.' The scratching stops. After an agonising wait, you hear sirens. You're saved... but was the voice really rescue?",
    choices: [],
  },
  diary_read: {
    text: "The diary reveals the cabin owner was a cultist who trapped souls here. The only way out is to destroy the heart of the house – a beating crystal in the basement. You must go to the basement.",
    choices: [
      { id: "go_basement_now", text: "Head straight to the basement", nextSceneId: "basement_creature" },
    ],
  },
  basement_creature: {
    text: "The thumping gets louder. In the corner, a pale, twisted creature clutches a glowing crystal. It screams. What do you do?",
    choices: [
      { id: "grab_crystal", text: "Rush forward and grab the crystal", nextSceneId: "crystal_grabbed" },
      { id: "run", text: "Run back up the stairs", nextSceneId: "barricade" },
      { id: "talk", text: "Try to communicate with it", nextSceneId: "talk_creature" },
    ],
  },
  crystal_grabbed: {
    text: "You seize the crystal. The creature shrieks and crumbles to dust. The house shakes. All the doors fly open. You escape into the dawn. Victory!",
    choices: [],
  },
  talk_creature: {
    text: "The creature tilts its head. It speaks in a broken whisper: 'Release me... break the crystal.' If you break it, the house will collapse. What will you do?",
    choices: [
      { id: "break_crystal", text: "Break the crystal", nextSceneId: "crystal_grabbed" },
      { id: "keep_crystal", text: "Keep the crystal and try to leave", nextSceneId: "trap" },
    ],
  },
  kitchen: {
    text: "You find a back door, but it's chained from the outside. Through the window you see an old truck. Maybe the keys are somewhere?",
    choices: [
      { id: "search_keys", text: "Search the kitchen for keys", nextSceneId: "trap" },
      { id: "break_window", text: "Break the window and run", nextSceneId: "outside" },
    ],
  },
  outside: {
    text: "You smash the window and scramble out. The house groans behind you. You run into the woods and eventually find a road. You're free!",
    choices: [],
  },
  final_stand: {
    text: "You grab pokers and a heavy log. The door bursts open – a massive shadowy figure stands there. You fight with everything you have...",
    choices: [
      { id: "charge", text: "Charge together", nextSceneId: "win_fight" },
      { id: "dodge", text: "Dodge and flank it", nextSceneId: "win_fight" },
    ],
  },
  win_fight: {
    text: "After a brutal struggle, the creature collapses into a pool of black ichor. The sun rises and the cabin's curse is broken. You survived.",
    choices: [],
  },
  hiding: {
    text: "You squeeze into closets. The door splinters, heavy footsteps enter, then silence. Hours later you creep out – the creature is gone, but so is one of your friends...",
    choices: [],
  },
  trap: {
    text: "You become trapped in a dead end. The creature finds you. Game over.",
    choices: [],
  },
};