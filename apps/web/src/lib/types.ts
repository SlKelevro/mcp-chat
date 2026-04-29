export type User = {
  id: string;
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type Chat = {
  id: string;
  title: string;
  userId: string;
};

export type MessageRole = 'system' | 'user' | 'assistant';

export type Message = {
  id: number;
  chatId: string;
  role: MessageRole;
  content: string;
};

export type MessageExchange = {
  userMessage: Message;
  assistantMessage: Message | null;
};

export type Session = {
  accessToken: string;
  userId: string;
  email: string;
};
