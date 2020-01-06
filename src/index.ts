import { interpret } from 'xstate';
import createGameMachine from './gameMachine';

const gameMachine = createGameMachine([0, 1, 2, 4, 6, 13]);
const service = interpret(gameMachine).onTransition(state => {
  if (state.changed) {
    console.log(state.value);
    console.log(state.context.cards);
  }
});

service.start();
service.send('NEXT' as any);
service.send('NEXT' as any);
service.send('NEXT' as any);
service.send('VOTE' as any);
