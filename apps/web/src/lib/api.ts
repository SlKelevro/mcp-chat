import { AuthResponse, Chat, Message, MessageExchange, User } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit, accessToken?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe(accessToken: string) {
  return request<User>('/auth/me', undefined, accessToken);
}

export async function listChats(accessToken: string) {
  return request<Chat[]>('/chats', undefined, accessToken);
}

export async function createChat(title: string, accessToken: string) {
  return request<Chat>('/chats', {
    method: 'POST',
    body: JSON.stringify({ title }),
  }, accessToken);
}

export async function listMessages(accessToken: string, chatId: string) {
  const query = new URLSearchParams({ chatId });
  return request<Message[]>(`/messages?${query.toString()}`, undefined, accessToken);
}

export async function sendMessage(chatId: string, content: string, accessToken: string) {
  return request<MessageExchange>('/messages', {
    method: 'POST',
    body: JSON.stringify({
      chatId,
      content,
    }),
  }, accessToken);
}
