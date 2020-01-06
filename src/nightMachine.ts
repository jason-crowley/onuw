import { Machine } from 'xstate';
import { Cards, NightWakeOrder, CardId, Role, WakeRole } from './types';

interface NightStateSchema {
  states: {
    [role in WakeRole | 'nightEnd']: {};
  };
}

type NightEvent = { type: 'NEXT' };

interface NightContext {
  cards: CardId[];
}

// Construct nightStates
let nightStates: Partial<NightStateSchema['states']> = { nightEnd: { type: 'final' } };
for (let i = 0; i < NightWakeOrder.length; i += 1) {
  const role: WakeRole = NightWakeOrder[i];
  const nextRole = NightWakeOrder[i + 1];

  nightStates = {
    ...nightStates,
    [role]: {
      on: {
        '': { target: nextRole, cond: `${role}NotInPlay` },
        NEXT: nextRole || 'nightEnd',
      },
    },
  };
}

export const nightMachine = Machine<NightContext, NightStateSchema, NightEvent>({
  id: 'night',
  context: {
    cards: [],
  },
  initial: NightWakeOrder[0],
  states: {
    ...(nightStates as NightStateSchema['states']),
  },
});

const createNightMachine = (cards: CardId[]) => {
  // TODO: change magic number 3 to account for Alpha Wolf
  const numPlayers = cards.length - 3;
  const playerCards: CardId[] = cards.slice(0, numPlayers);
  const startRoles = new Set<Role>(playerCards.map(card => Cards[card]));
  const notInPlay = (role: WakeRole) => !startRoles.has(role);

  return nightMachine
    .withContext({
      ...nightMachine.context,
      cards,
    })
    .withConfig({
      guards: {
        // doppelgangerNotInPlay: () => notInPlay('doppelganger'),
        werewolfNotInPlay: () => notInPlay('werewolf'),
        minionNotInPlay: () => notInPlay('minion'),
        masonNotInPlay: () => notInPlay('mason'),
        seerNotInPlay: () => notInPlay('seer'),
        robberNotInPlay: () => notInPlay('robber'),
        troublemakerNotInPlay: () => notInPlay('troublemaker'),
        drunkNotInPlay: () => notInPlay('drunk'),
        insomniacNotInPlay: () => notInPlay('insomniac'),
      },
    });
};

export default createNightMachine;
