export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatListItem {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: number;
}

export interface ApiConfig {
  apiKey: string;
  model: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}