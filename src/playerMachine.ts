import { Machine, actions } from 'xstate';

const { raise } = actions;

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
        role: {
          states: {
            [role in Role | 'noRole']: {};
          };
        };
      };
    };
  };
}

type AssignEvent = { type: 'ASSIGN'; role: Role };
type PlayerEvent = AssignEvent | { type: 'WAKE' } | { type: 'SLEEP' };

const createPlayerMachine = () =>
  Machine(
    {
      id: 'player',
      initial: 'unassigned',
      states: {
        unassigned: {
          on: {
            ASSIGN: {
              actions: 'assignRole',
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
            role: {
              initial: 'noRole',
              states: {
                noRole: {},
                villager1: {},
                villager2: {},
                villager3: {},
                werewolf1: {},
                werewolf2: {},
                seer: {},
                robber: {},
                troublemaker: {},
                tanner: {},
                drunk: {},
                hunter: {},
                mason1: {},
                mason2: {},
                insomniac: {},
                minion: {},
                // doppelganger: {},
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
        assignRole: (context, event) => raise(`.role.${(event as AssignEvent).role}`),
      },
    },
  );

export default createPlayerMachine;
