import { Scene } from './types';

export const story: Record<string, Scene> = {
  start: {
    text: '',
    choices: [
      { id: 'listen_broadcast', text: 'Listen to the emergency broadcast closer, gain every detail', nextSceneId: 'tv_broadcast' },
      { id: 'touch_jacob', text: 'Gang rape Jacob, then listen to the broadcast', nextSceneId: 'tv_broadcast' },
    ],
  },
  tv_broadcast: {
    text: 'What should we do?',
    choices: [
      { id: 'symptom_check', text: 'Ask each member if they have any symptoms of sickness', nextSceneId: 'symptom_check', givesItem: 'rope' },
      { id: 'check_outside', text: 'See if anything is happening outside', nextSceneId: 'check_outside' },   // feeding Sean leads to fleeing after chaos
    ],
  },

};