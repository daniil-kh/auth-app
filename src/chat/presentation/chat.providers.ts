import { Chat } from '../infrastructure/repositories';

const CHAT_REPOSITORY = 'CHAT_REPOSITORY';

export const chatProviders = [
  {
    provide: CHAT_REPOSITORY,
    useValue: Chat,
  },
];
