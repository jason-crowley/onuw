import { Machine, StatesConfig, actions } from 'xstate';

const { raise } = actions;

interface NightStateSchema {
  states: {
    // doppelganger: {},
    // doppelMinion: {},
    werewolf: {};
    minion: {};
    mason: {};
    seer: {};
    robber: {};
    troublemaker: {};
    drunk: {};
    insomniac: {};
    nightEnd: {};
  };
}

type NightEvent = { type: 'NEXT' };

interface NightContext {
  roles: Role[];
}

const createNightMachine = (roles: Role[]) => {
  // TODO: change magic number 3 to account for Alpha Wolf
  const numPlayers = roles.length - 3;
  // TODO: ensure that we only consider player's INITIAL roles
  const startRoles = new Set<Role>(roles.slice(0, numPlayers));
  const hasNone = (..._roles: Role[]) => !_roles.some(role => startRoles.has(role));

  // TODO: add doppel roles
  const nightOrder = [
    'werewolf',
    'minion',
    'mason',
    'seer',
    'robber',
    'troublemaker',
    'drunk',
    'insomniac',
    'nightEnd',
  ];
  // Construct nightStates
  let nightStates: Partial<NightStateSchema['states']> = { nightEnd: { type: 'final' } };
  for (let i = 0; i < nightOrder.length - 1; i += 1) {
    const current = nightOrder[i];
    const next = nightOrder[i + 1];
    const capitalizedCurrent = current.charAt(0).toUpperCase() + current.slice(1);

    nightStates = {
      ...nightStates,
      [current]: {
        on: {
          '': { target: next, cond: `no${capitalizedCurrent}` },
          NEXT: next,
        },
      },
    };
  }

  return Machine<NightContext, NightStateSchema, NightEvent>(
    {
      id: 'night',
      context: {
        roles,
      },
      initial: 'werewolf', // TODO: change when doppel added
      states: {
        // doppelganger: {},
        // doppelMinion: {},
        ...(nightStates as NightStateSchema['states']),
      },
    },
    {
      guards: {
        noWerewolf: () => hasNone('werewolf1', 'werewolf2'),
        noMinion: () => hasNone('minion'),
        noMason: () => hasNone('mason1', 'mason2'),
        noSeer: () => hasNone('seer'),
        noRobber: () => hasNone('robber'),
        noTroublemaker: () => hasNone('troublemaker'),
        noDrunk: () => hasNone('drunk'),
        noInsomniac: () => hasNone('insomniac'),
      },
    },
  );
};

export default createNightMachine;
