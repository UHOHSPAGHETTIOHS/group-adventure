import { Scene } from './types';

export const story: Record<string, Scene> = {
  start: {
    text: '',
    choices: [
      { id: 'listen_broadcast', text: 'Listen to the emergency broadcast', nextSceneId: 'tv_broadcast' },
      { id: 'touch_jacob', text: 'Touch Jacob, then listen to the broadcast', nextSceneId: 'tv_broadcast' },
    ],
  },
  tv_broadcast: {
    text: 'What should we do?',
    choices: [
      { id: 'tie_up', text: 'Tie Mason up and secure the basement', nextSceneId: 'tie_mason', givesItem: 'rope' },
      { id: 'flee', text: 'Flee the basement immediately', nextSceneId: 'flee_basement' },
    ],
  },
  tie_mason: {
    text: 'Mason is tied. Now what?',
    choices: [
      { id: 'search_upstairs', text: 'Search the upstairs for supplies', nextSceneId: 'upstairs_hallway', givesItem: 'flashlight' },
      { id: 'stay_basement', text: 'Stay in the basement and wait for rescue', nextSceneId: 'stay_basement' },
    ],
  },
  flee_basement: {
    text: "You're in the stairwell. The door to outside is ahead.",
    choices: [
      { id: 'go_outside', text: 'Open the door and go outside', nextSceneId: 'outside_yard' },
      { id: 'go_upstairs', text: 'Head upstairs instead', nextSceneId: 'upstairs_hallway' },
    ],
  },
  upstairs_hallway: {
    text: 'You are upstairs. It’s dark and quiet.',
    choices: [
      { id: 'check_kitchen', text: 'Go to the kitchen', nextSceneId: 'kitchen' },
      { id: 'check_bedroom', text: 'Search the bedroom', nextSceneId: 'bedroom' },
    ],
  },
  stay_basement: {
    text: 'You decide to wait. Hours pass…',
    choices: [],
  },
  outside_yard: {
    text: 'You step into the cold night air.',
    choices: [],
  },
};