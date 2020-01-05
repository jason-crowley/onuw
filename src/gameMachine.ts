import { Machine, assign, send } from 'xstate';
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
  roles: Role[];
}

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const createGameMachine = (roles: Role[]) =>
  Machine<GameContext, GameStateSchema, GameEvent>(
    {
      id: 'game',
      context: {
        roles,
      },
      initial: 'setup',
      states: {
        setup: {
          on: {
            '': {
              target: 'night',
              actions: 'shuffle',
            },
          },
        },
        night: {
          invoke: {
            id: 'night',
            src: createNightMachine(roles),
            onDone: 'day',
            data: { roles: (context: GameContext, event: GameEvent) => context.roles },
          },
          on: {
            NEXT: { actions: send('NEXT', { to: 'night' }) },
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
        shuffle: assign({ roles: context => context.roles }),
        swap: assign({ roles: context => context.roles }),
      },
      guards: {},
    },
  );

export default createGameMachine;
