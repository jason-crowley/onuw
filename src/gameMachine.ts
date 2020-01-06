import { Machine, assign, forwardTo } from 'xstate';
import { CardId } from './types';
import createNightMachine from './nightMachine';

interface GameStateSchema {
  states: {
    setup: {};
    night: {};
    day: {};
    gameEnd: {};
  };
}

type GameEvent = { type: 'NEXT' } | { type: 'VOTE' };

interface GameContext {
  cards: CardId[];
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const gameMachine = Machine<GameContext, GameStateSchema, GameEvent>(
  {
    id: 'game',
    context: {
      cards: [],
    },
    initial: 'setup',
    states: {
      setup: {
        on: {
          '': {
            target: 'night',
            actions: ['shuffle', 'assign'],
          },
        },
      },
      night: {
        invoke: {
          id: 'night',
          src: 'nightMachine',
          onDone: 'day',
        },
        on: {
          NEXT: { actions: 'forwardToNight' },
        },
      },
      day: {
        on: { VOTE: 'gameEnd' },
      },
      gameEnd: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      shuffle: assign({ cards: context => shuffle<CardId>(context.cards) }),
      forwardToNight: forwardTo('night'),
      swap: assign({ cards: context => context.cards }),
    },
  },
);

const createGameMachine = (cards: CardId[]) => {
  const createPlayers = () => [];

  return gameMachine
    .withContext({
      ...gameMachine.context,
      cards,
    })
    .withConfig({
      services: {
        nightMachine: context => createNightMachine(context.cards),
      },
    });
};

export default createGameMachine;
