import { Machine, assign } from 'xstate';
import { CardId } from './types';

interface PlayerStateSchema {
  states: {
    unassigned: {};
    assigned: {
      states: {
        sleep: {
          states: {
            asleep: {};
            awake: {};
          };
        };
      };
    };
  };
}

type AssignEvent = { type: 'ASSIGN'; card: CardId };
type PlayerEvent = AssignEvent | { type: 'WAKE' } | { type: 'SLEEP' };

interface PlayerContext {
  card: CardId;
}

const createPlayerMachine = () =>
  Machine<PlayerContext, PlayerStateSchema, PlayerEvent>(
    {
      id: 'player',
      // context: {
      //   card: null,
      // },
      initial: 'unassigned',
      states: {
        unassigned: {
          on: {
            ASSIGN: {
              actions: 'assignCard',
            },
          },
        },
        assigned: {
          type: 'parallel',
          states: {
            sleep: {
              initial: 'asleep',
              states: {
                asleep: {},
                awake: {},
              },
            },
          },
          on: {
            WAKE: '.sleep.awake',
            SLEEP: '.sleep.asleep',
          },
        },
      },
    },
    {
      actions: {
        assignCard: assign({ card: context => context.card }),
      },
    },
  );

export default createPlayerMachine;
