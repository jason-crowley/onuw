import { interpret } from 'xstate';
import createGameMachine from './gameMachine';

const gameMachine = createGameMachine(['werewolf1', 'robber', 'seer', 'troublemaker', 'werewolf2', 'mason2'] as Role[]);
const service = interpret(gameMachine).onTransition(state => {
  console.log(state.value);
});

service.start();
service.children.get('night')!.send('NEXT' as any);
service.children.get('night')!.send('NEXT' as any);
service.children.get('night')!.send('NEXT' as any);
service.children.get('night')!.send('NEXT' as any);
service.children.get('night')!.send('NEXT' as any);
